import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'
import { UserRole } from '@/types'

// API route permissions
const apiRoutePermissions: Record<string, UserRole[]> = {
  '/api/admin/': ['admin', 'owner', 'super_user'],
  '/api/owner/': ['owner', 'super_user'],
  '/api/super/': ['super_user'],
}

export async function withRoleAuth(
  request: NextRequest,
  handler: (request: NextRequest, userRole: UserRole) => Promise<NextResponse>
) {
  try {
    const supabase = createRouteHandlerClient()
    
    // Get user session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      return NextResponse.json(
        { error: 'Unauthorized: Please login' },
        { status: 401 }
      )
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'Unauthorized: Profile not found' },
        { status: 401 }
      )
    }

    // Check API route permissions
    const pathname = request.nextUrl.pathname
    const requiredRoles = Object.entries(apiRoutePermissions).find(([route]) =>
      pathname.startsWith(route)
    )?.[1]

    if (requiredRoles && !requiredRoles.includes(profile.role as UserRole)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      )
    }

    // Call the actual handler with the user role
    return await handler(request, profile.role as UserRole)
  } catch (error) {
    console.error('API Auth middleware error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function for role-based page protection
export function requireRole(allowedRoles: UserRole[]) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      const supabase = createRouteHandlerClient()
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!profile || !allowedRoles.includes(profile.role as UserRole)) {
        return NextResponse.rewrite(new URL('/not-found', request.url))
      }

      return null // Allow access
    } catch (error) {
      console.error('Role check error:', error)
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }
}
