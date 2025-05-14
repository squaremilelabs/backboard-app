import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes, except for api/webhooks/
    "/api/((?!webhooks).*)",
  ],
}

export default clerkMiddleware(async (auth, req) => {
  await auth.protect()
  if (req.nextUrl.pathname === "/") {
    const { userId } = await auth()
    if (userId) {
      return NextResponse.redirect(new URL("/calendar", req.url))
    }
  }
})
