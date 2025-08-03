import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase'
import { generateOrderId } from '@/lib/midtrans'
import { createRateLimiter, sanitizeInput } from '@/lib/security'

// Rate limiter: 30 requests per minute per IP
const rateLimiter = createRateLimiter(30, 60 * 1000)

export async function GET(request: NextRequest) {
  try {
    // Security: Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1'

    // Security: Rate limiting
    if (!rateLimiter(clientIP)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const supabase = createRouteHandlerClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const status = searchParams.get('status')
    
    // Security: Validate and sanitize inputs
    const sanitizedUserId = userId ? sanitizeInput(userId) : null
    const sanitizedStatus = status ? sanitizeInput(status) : null
    
    let query = supabase
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
      .order('created_at', { ascending: false })

    if (sanitizedUserId) {
      query = query.eq('user_id', sanitizedUserId)
    }

    if (sanitizedStatus) {
      query = query.eq('status', sanitizedStatus)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: orders
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

    const {
      table_id,
      items,
      notes
    } = body

    // Validate table exists
    const { data: table, error: tableError } = await supabase
      .from('tables')
      .select('id, table_number')
      .eq('id', table_id)
      .eq('is_active', true)
      .single()

    if (tableError || !table) {
      return NextResponse.json(
        { error: 'Invalid table' },
        { status: 400 }
      )
    }

    // Calculate total amount
    let totalAmount = 0
    const orderItems = []

    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('id, price')
        .eq('id', item.product_id)
        .single()

      if (product) {
        const itemTotal = product.price * item.quantity
        totalAmount += itemTotal
        orderItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
          customizations: item.customizations
        })
      }
    }

    // Get current user (optional for guest orders)
    const { data: { user } } = await supabase.auth.getUser()

    // Generate order number
    const orderNumber = generateOrderId()

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id || null,
        table_id,
        order_number: orderNumber,
        midtrans_order_id: orderNumber, // Set midtrans_order_id sama dengan order_number
        total_amount: totalAmount,
        notes,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        table,
        items: orderItemsWithOrderId
      }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
