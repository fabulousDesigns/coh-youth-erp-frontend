// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const path = request.nextUrl.pathname

  // Get user from cookie if exists
  const user = request.cookies.get('user')?.value
    ? JSON.parse(request.cookies.get('user')?.value || '{}')
    : null

  // Public paths that don't require authentication
  if (path === '/login') {
    if (token) {
      return NextResponse.redirect(new URL(
        user?.role === 'admin' ? '/admin/dashboard' : '/volunteer/dashboard',
        request.url
      ))
    }
    return NextResponse.next()
  }

  // Check for authenticated routes
  if (path.startsWith('/admin') || path.startsWith('/volunteer')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role-based access control
    if (path.startsWith('/admin') && user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/volunteer/dashboard', request.url))
    }

    if (path.startsWith('/volunteer') && user?.role !== 'volunteer') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/volunteer/:path*', '/login']
}