import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  try {
    const isApiRes = req.nextUrl.pathname.startsWith("/adminro");

    if (isApiRes) {
      const basicAuth = req.headers.get("authorization");
      if (basicAuth) {
        const authValue = basicAuth.split(" ")[1];
        const [user, pwd] = atob(authValue).split(":");
        if (user === "admin" && pwd === "Robbin#1500xx") {
          return NextResponse.next();
        }
      }
      return new NextResponse("Auth required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
      });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const signInUrl = new URL("/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch {
    const signInUrl = new URL("/auth/signin", req.url);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    "/render/:path*",
    "/gallery/:path*",
    "/settings/:path*",
    "/help/:path*",
    "/adminro/:path*",
  ],
};
