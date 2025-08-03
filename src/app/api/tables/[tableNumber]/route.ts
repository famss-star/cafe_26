import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableNumber: string }> }
) {
  try {
    const supabase = createRouteHandlerClient()
    const resolvedParams = await params
    const tableNumber = parseInt(resolvedParams.tableNumber)
    
    if (isNaN(tableNumber)) {
      return NextResponse.json(
        { error: 'Invalid table number' },
        { status: 400 }
      )
    }

    // Get table by table number
    const { data: table, error } = await supabase
      .from('tables')
      .select('*')
      .eq('table_number', tableNumber)
      .eq('is_active', true)
      .single()

    if (error || !table) {
      return NextResponse.json(
        { error: 'Table not found' },
        { status: 404 }
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
