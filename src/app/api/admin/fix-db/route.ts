import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Admin API untuk fix database issues
export async function POST(request: NextRequest) {
  try {
    const { action, userId } = await request.json()

    // Use service role key for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Butuh service role key
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    if (action === 'create_missing_profile') {
      // Get user info from auth
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
      
      if (authError || !authUser.user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Create profile using service role (bypasses RLS)
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: authUser.user.id,
          email: authUser.user.email,
          name: authUser.user.email?.split('@')[0] || 'User',
          role: 'customer', // Default role
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('Profile creation error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, profile: data })
    }

    if (action === 'fix_super_user') {
      // Fix super user profile specifically
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: '664b84c8-39b0-4025-84c0-55bd0e8b4637',
          email: 'dev@gmail.com',
          name: 'Super User',
          role: 'super_user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('Super user fix error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, profile: data })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Admin API for fixing database issues',
    available_actions: [
      'create_missing_profile',
      'fix_super_user'
    ]
  })
}
