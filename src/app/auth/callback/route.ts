import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Supabase emails (signup verification, magic link, password recovery) all
// redirect here with a `code` query param. We exchange it for a session
// cookie and forward the user to a sensible next page.

function safeNext(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const type = searchParams.get("type"); // "recovery" | "signup" | "magiclink"
  const errorDescription = searchParams.get("error_description");
  const next = safeNext(searchParams.get("next"));

  if (errorDescription) {
    const target = new URL("/login", origin);
    target.searchParams.set("error", errorDescription);
    return NextResponse.redirect(target);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!code || !url || !key) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  // Recovery flow needs the user to set a new password; everything else
  // can drop them on the dashboard (or wherever ?next= says).
  const destination = type === "recovery" ? "/reset-password" : next;
  const response = NextResponse.redirect(new URL(destination, origin));

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const target = new URL("/login", origin);
    target.searchParams.set("error", error.message);
    return NextResponse.redirect(target);
  }

  return response;
}
