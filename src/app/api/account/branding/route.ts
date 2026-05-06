import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { meetsTier } from "@/lib/plans";
import type { SubscriptionTier } from "@/types/database";

const BUCKET = "brand_assets";
const MAX_LOGO_BYTES = 1_500_000; // 1.5 MB
const ALLOWED_LOGO_MIME = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];

async function requireProUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .maybeSingle<{ subscription_tier: SubscriptionTier }>();
  const tier = profile?.subscription_tier ?? "free";
  if (!meetsTier(tier, "pro")) {
    return {
      error: NextResponse.json(
        { error: "Branded reports require the Professional plan." },
        { status: 402 },
      ),
    };
  }
  return { supabase, user };
}

export async function GET() {
  const ok = await requireProUser();
  if ("error" in ok) return ok.error;
  const { supabase, user } = ok;

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_name, brand_logo_path, brand_color, brand_footer")
    .eq("id", user.id)
    .maybeSingle<{
      org_name: string | null;
      brand_logo_path: string | null;
      brand_color: string | null;
      brand_footer: string | null;
    }>();

  let brand_logo_url: string | null = null;
  if (profile?.brand_logo_path) {
    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(profile.brand_logo_path);
    brand_logo_url = data.publicUrl;
  }

  return NextResponse.json({
    branding: {
      org_name: profile?.org_name ?? null,
      brand_logo_url,
      brand_color: profile?.brand_color ?? null,
      brand_footer: profile?.brand_footer ?? null,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const ok = await requireProUser();
  if ("error" in ok) return ok.error;
  const { supabase, user } = ok;

  const contentType = request.headers.get("content-type") ?? "";
  let logoPath: string | null | undefined; // undefined = no change, null = clear

  // Multipart -> includes a logo file (or a `clear_logo` flag).
  // Plain JSON -> only updates org_name / brand_color / brand_footer.
  type Patch = {
    org_name?: string | null;
    brand_color?: string | null;
    brand_footer?: string | null;
  };
  const patch: Patch = {};

  if (contentType.startsWith("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("logo");
    const clear = form.get("clear_logo");
    if (clear === "1") {
      logoPath = null;
    } else if (file instanceof File) {
      if (!ALLOWED_LOGO_MIME.includes(file.type)) {
        return NextResponse.json(
          { error: "Logo must be PNG, JPEG, SVG, or WEBP." },
          { status: 400 },
        );
      }
      if (file.size > MAX_LOGO_BYTES) {
        return NextResponse.json(
          { error: "Logo must be under 1.5 MB." },
          { status: 400 },
        );
      }
      const ext = file.type.split("/")[1] === "svg+xml" ? "svg" : file.type.split("/")[1];
      const path = `${user.id}/logo.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: true });
      if (upErr) {
        return NextResponse.json({ error: upErr.message }, { status: 500 });
      }
      logoPath = path;
    }
    const orgName = form.get("org_name");
    const brandColor = form.get("brand_color");
    const brandFooter = form.get("brand_footer");
    if (typeof orgName === "string") patch.org_name = orgName.trim() || null;
    if (typeof brandColor === "string") patch.brand_color = sanitizeColor(brandColor);
    if (typeof brandFooter === "string") patch.brand_footer = brandFooter.slice(0, 200) || null;
  } else {
    let body: Patch;
    try {
      body = (await request.json()) as Patch;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (body.org_name !== undefined) patch.org_name = body.org_name?.trim() || null;
    if (body.brand_color !== undefined) patch.brand_color = sanitizeColor(body.brand_color);
    if (body.brand_footer !== undefined) patch.brand_footer = body.brand_footer?.slice(0, 200) || null;
  }

  if (logoPath !== undefined) {
    if (logoPath === null) {
      // Clearing — best-effort delete from storage too.
      const { data: existing } = await supabase
        .from("profiles")
        .select("brand_logo_path")
        .eq("id", user.id)
        .maybeSingle<{ brand_logo_path: string | null }>();
      if (existing?.brand_logo_path) {
        await supabase.storage
          .from(BUCKET)
          .remove([existing.brand_logo_path])
          .catch(() => null);
      }
    }
    (patch as Record<string, unknown>).brand_logo_path = logoPath;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ ok: true, unchanged: true });
  }

  // Profiles RLS blocks user-context UPDATEs (billing fields are admin-only).
  // We've already authenticated the user via getUser() above, so bypass RLS
  // with the service-role client and write only the safe-to-edit columns.
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Server is missing SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 },
    );
  }
  const { error } = await admin.from("profiles").update(patch).eq("id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

function sanitizeColor(input: string | null | undefined): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  // Accept #rgb, #rrggbb, #rrggbbaa.
  return /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3}([0-9a-fA-F]{2})?)?$/.test(trimmed)
    ? trimmed
    : null;
}
