import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value

  if (!token) {
    // Redirect to login if token is missing
    // ?unauthorized=true so we can throw an error message
    return NextResponse.redirect(
      new URL('/login?unauthorized=true', request.url),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
