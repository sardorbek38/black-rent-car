import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";

const LOCALES = ["uz", "ru"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const ok = await verifyToken(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!ok) return NextResponse.redirect(new URL("/admin/login", req.url));
    return NextResponse.next();
  }

  const first = pathname.split("/")[1];
  if (LOCALES.includes(first)) return NextResponse.next();

  const pref = req.cookies.get("lang")?.value;
  const accept = req.headers.get("accept-language") ?? "";
  const locale = pref && LOCALES.includes(pref) ? pref : /^ru\b/i.test(accept) ? "ru" : "uz";
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|logo.png|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};
