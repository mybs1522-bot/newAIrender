import { NextRequest, NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { consumeTransferToken } from "@/lib/device-auth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/auth/signin", req.url));

  const user = await consumeTransferToken(token);
  if (!user) return NextResponse.redirect(new URL("/auth/signin?error=expired", req.url));

  const sessionToken = await encode({
    token: {
      name: user.userName,
      email: user.userEmail,
      picture: user.userImage,
      sub: user.userId ?? user.userEmail,
    },
    secret: process.env.NEXTAUTH_SECRET!,
  });

  const isSecure = req.url.startsWith("https://");
  const cookieName = isSecure
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

  const response = NextResponse.redirect(new URL("/render", req.url));
  response.cookies.set(cookieName, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isSecure,
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}
