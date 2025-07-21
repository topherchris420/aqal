// Legacy NextAuth route - now redirects to built-in auth
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Redirect to our built-in auth system
  return NextResponse.redirect(new URL("/auth/signin", request.url))
}

export async function POST(request: NextRequest) {
  // Handle legacy auth requests
  return NextResponse.json(
    {
      error: "This application now uses built-in authentication. Please use the sign-in page.",
    },
    { status: 400 },
  )
}
