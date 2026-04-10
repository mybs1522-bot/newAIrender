import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  try {
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
  ],
};
