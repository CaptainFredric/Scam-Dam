import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PREFIXES = ["/dashboard", "/cases", "/billing", "/account"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!isProtected) return NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // No Supabase configured — fall back to demo-cookie check so local dev /
  // demo deployments still work.
  if (!url || !key) {
    const demoCookie = request.cookies.get("scamdam_demo_user");
    if (!demoCookie) return redirectToLogin(request);
    return NextResponse.next();
  }

  // Bind Supabase to this request/response so refreshed tokens get written
  // back as cookies on the response we return.
  const response = NextResponse.next();
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Allow demo-cookie fallback even when Supabase is configured (lets a
    // user explore the dashboard without committing to a signup).
    if (request.cookies.get("scamdam_demo_user")) return response;
    return redirectToLogin(request);
  }

  return response;

  function redirectToLogin(req: NextRequest) {
    const target = new URL("/login", req.url);
    target.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(target);
  }
}

export const config = {
  // Skip Next internals, the API namespace, static assets, and the public
  // marketing pages — we only need to gate the app surface.
  matcher: ["/dashboard/:path*", "/cases/:path*", "/billing/:path*", "/account/:path*"],
};
