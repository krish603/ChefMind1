import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // // Exclude Next.js internals, static files, and assets
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|map|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf)).*)",
    // // Ensure all API and trpc routes are protected
    // "/(api|trpc)(.*)",
  ],
};
