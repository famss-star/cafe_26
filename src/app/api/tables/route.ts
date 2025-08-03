import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient()
    
    // Get all active tables
    const { data: tables, error } = await supabase
      .from('tables')
      .select('*')
      .eq('is_active', true)
      .order('table_number', { ascending: true })

    if (error) {
      console.error('Error fetching tables:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tables' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: tables
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient()
    const body = await request.json()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin or owner
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['admin', 'owner', 'super_user'].includes(profile.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Check if table number already exists
    const { data: existingTable } = await supabase
      .from('tables')
      .select('id')
      .eq('table_number', body.table_number)
      .single()

    if (existingTable) {
      return NextResponse.json(
        { error: 'Table number already exists' },
        { status: 400 }
      )
    }

    // Generate QR code string
    const qrCode = `${process.env.NEXT_PUBLIC_BASE_URL}/table/${body.table_number}`

    // Create table
    const { data: table, error } = await supabase
      .from('tables')
      .insert({
        table_number: body.table_number,
        qr_code: qrCode,
        is_active: body.is_active ?? true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating table:', error)
      return NextResponse.json(
        { error: 'Failed to create table' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: table
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
