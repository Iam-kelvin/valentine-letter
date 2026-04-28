import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/create(.*)",
  "/dashboard/letters(.*)",
  "/api/generate(.*)",
  "/dashboard/anonymous(.*)",
  "/api/anonymous/profile(.*)",
  "/api/anonymous/messages(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
