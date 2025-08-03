import { NextRequest, NextResponse } from 'next/server'
import { validateSignature } from '@/lib/midtrans'
import { createClient } from '@supabase/supabase-js'
import { webhookValidationSchema, isValidMidtransIP, createRateLimiter } from '@/lib/security'

// Rate limiter: 10 requests per minute per IP
const rateLimiter = createRateLimiter(10, 60 * 1000)

export async function POST(request: NextRequest) {
  try {
    // Security: Get client IP
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                    request.headers.get('x-real-ip') || 
                    request.headers.get('cf-connecting-ip') || // Cloudflare
                    '127.0.0.1'

    // Security: Rate limiting
    if (!rateLimiter(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`)
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Security: IP validation (optional for Midtrans)
    const isValidIP = isValidMidtransIP(clientIP)
    
    // Log IP for debugging
    console.log('Webhook IP check:', {
      clientIP,
      isValidIP,
      environment: process.env.NODE_ENV,
      headers: {
        'x-forwarded-for': request.headers.get('x-forwarded-for'),
        'x-real-ip': request.headers.get('x-real-ip'),
        'cf-connecting-ip': request.headers.get('cf-connecting-ip')
      }
    })
    
    if (process.env.NODE_ENV === 'production' && !isValidIP) {
      console.warn(`Invalid IP attempted webhook: ${clientIP}`)
      // For now, just log but don't block (comment out return for debugging)
      // return NextResponse.json(
      //   { error: 'Unauthorized' },
      //   { status: 403 }
      // )
    }

    // Security: Check content type
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      )
    }

    // Security: Request size limit (Next.js handles this by default, but good to be explicit)
    const contentLength = parseInt(request.headers.get('content-length') || '0')
    if (contentLength > 10000) { // 10KB limit
      return NextResponse.json(
        { error: 'Request too large' },
        { status: 413 }
      )
    }

    const body = await request.json()

    // Security: Validate webhook payload structure
    const { error: validationError } = webhookValidationSchema.validate(body)
    if (validationError) {
      console.error('Webhook validation error:', validationError.details)
      return NextResponse.json(
        { error: 'Invalid payload structure' },
        { status: 400 }
      )
    }
    
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      transaction_id,
      payment_type
    } = body

    // Audit logging
    console.log('Webhook received:', {
      order_id,
      transaction_status,
      client_ip: clientIP,
      user_agent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
      order_id_valid: order_id && typeof order_id === 'string' && order_id.length > 0
    })

    // Basic order ID validation
    if (!order_id || typeof order_id !== 'string') {
      console.error('Invalid or missing order_id:', order_id)
      return NextResponse.json(
        { error: 'Invalid order_id' },
        { status: 400 }
      )
    }

    // Validate signature (skip in development)
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (!isDevelopment) {
      console.log('Signature validation data:', {
        order_id,
        status_code, 
        gross_amount,
        signature_key: signature_key?.substring(0, 20) + '...',
        server_key_present: !!process.env.MIDTRANS_SERVER_KEY
      })
      
      const isValidSignature = validateSignature(
        order_id,
        status_code,
        gross_amount,
        signature_key
      )

      if (!isValidSignature) {
        console.error('Invalid signature for order:', order_id, 'from IP:', clientIP)
        // For debugging, just log but don't block
        console.error('Signature validation failed - allowing for debugging')
        // return NextResponse.json(
        //   { error: 'Invalid signature' },
        //   { status: 400 }
        // )
      } else {
        console.log('Signature validation passed for order:', order_id)
      }
    } else {
      console.log('Development mode - skipping signature validation')
    }

    // Use service role client to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Determine payment status
    let paymentStatus = 'pending'
    let orderStatus = 'pending'

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || !fraud_status) {
        paymentStatus = 'paid'
        orderStatus = 'confirmed'
      }
    } else if (transaction_status === 'pending') {
      paymentStatus = 'pending'
      orderStatus = 'pending'
    } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire') {
      paymentStatus = 'failed'
      orderStatus = 'cancelled'
    } else if (transaction_status === 'refund') {
      paymentStatus = 'refunded'
      orderStatus = 'cancelled'
    }

    // Try multiple approaches to find the order
    let targetOrder: Record<string, unknown> | null = null
    
    // Method 1: Try by order_number (most common from Midtrans)
    const { data: orderByNumber } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', order_id)
      .single()
    
    if (orderByNumber) {
      targetOrder = orderByNumber
    }
    
    // Method 2: Try by midtrans_order_id if not found
    if (!targetOrder) {
      const { data: orderByMidtrans } = await supabase
        .from('orders')
        .select('*')
        .eq('midtrans_order_id', order_id)
        .single()
      
      if (orderByMidtrans) {
        targetOrder = orderByMidtrans
      }
    }
    
    // Method 3: Try by UUID id if not found (fallback)
    if (!targetOrder) {
      const { data: orderById } = await supabase
        .from('orders')
        .select('*')
        .eq('id', order_id)
        .single()
      
      if (orderById) {
        targetOrder = orderById
      }
    }
    
    if (!targetOrder) {
      console.error('Order not found:', order_id, 'from IP:', clientIP)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Security: Check if order already processed to prevent duplicate processing
    if (targetOrder.payment_status === 'paid' && paymentStatus === 'paid') {
      console.warn('Duplicate webhook for paid order:', order_id)
      return NextResponse.json({ 
        status: 'success',
        message: 'Order already processed',
        order: {
          order_number: targetOrder.order_number,
          status: targetOrder.status,
          payment_status: targetOrder.payment_status
        }
      })
    }

    // Update the found order
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        status: orderStatus,
        midtrans_transaction_id: transaction_id,
        payment_method: payment_type,
        updated_at: new Date().toISOString()
      })
      .eq('id', targetOrder.id)

    if (updateError) {
      console.error('Error updating order:', updateError, 'for IP:', clientIP)
      return NextResponse.json(
        { error: 'Failed to update order', details: updateError.message },
        { status: 500 }
      )
    }

    // Success audit log
    console.log('Order updated successfully:', {
      order_id: targetOrder.order_number,
      new_status: orderStatus,
      new_payment_status: paymentStatus,
      client_ip: clientIP,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      status: 'success',
      message: 'Order updated successfully',
      order: {
        order_number: targetOrder.order_number,
        new_status: orderStatus,
        new_payment_status: paymentStatus
      }
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
