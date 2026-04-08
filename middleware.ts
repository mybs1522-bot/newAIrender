export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/render/:path*",
    "/gallery/:path*",
    "/settings/:path*",
    "/help/:path*",
  ],
};
