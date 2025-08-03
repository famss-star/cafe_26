import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient()
    const { id } = await params
    const orderId = id
    
    // Get order with related data
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            price,
            image_url
          )
        ),
        tables (
          id,
          table_number
        ),
        profiles (
          id,
          full_name,
          email
        )
      `)
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient()
    const { id } = await params
    const orderId = id
    const body = await request.json()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    // Check if user is admin/owner or order owner
    let canUpdate = false
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile && ['admin', 'owner', 'super_user'].includes(profile.role)) {
        canUpdate = true
      } else {
        // Check if user owns the order
        const { data: order } = await supabase
          .from('orders')
          .select('user_id')
          .eq('id', orderId)
          .single()

        if (order && order.user_id === user.id) {
          canUpdate = true
        }
      }
    }

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Update order
    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(body)
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
