import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Just allow all requests for now - client-side protection handles auth
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
