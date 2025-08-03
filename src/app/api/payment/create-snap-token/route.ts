import { NextRequest, NextResponse } from 'next/server'
import { midtransConfig } from '@/lib/midtrans'
import { createRouteHandlerClient } from '@/lib/supabase'

interface ItemDetail {
  id: string
  name?: string
  product_name?: string
  price?: number
  product_price?: number
  product_id?: string
  quantity?: number
}

interface PaymentRequestBody {
  transaction_details: {
    order_id: string
    gross_amount: number
  }
  customer_details?: {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
  }
  item_details?: ItemDetail[]
  callbacks?: {
    finish?: string
    unfinish?: string
    error?: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequestBody = await request.json()
    console.log('Received payment request:', JSON.stringify(body, null, 2))
    
    // Log each item detail to debug
    if (body.item_details) {
      console.log('Item details breakdown:')
      body.item_details.forEach((item: ItemDetail, index: number) => {
        console.log(`Item ${index}:`, JSON.stringify(item, null, 2))
        console.log(`Item ${index} has name:`, !!item.name)
        console.log(`Item ${index} has price:`, !!item.price)
      })
    }
    
    const {
      transaction_details,
      customer_details,
      item_details: originalItemDetails,
      callbacks
    } = body

    // Fix item_details if missing name or price
    let item_details = originalItemDetails
    if (originalItemDetails && Array.isArray(originalItemDetails)) {
      const supabase = createRouteHandlerClient()
      
      item_details = await Promise.all(originalItemDetails.map(async (item: ItemDetail) => {
        const fixedItem = {
          id: item.id || item.product_id || '',
          name: item.name || item.product_name,
          price: Number(item.price || item.product_price || 0),
          quantity: Number(item.quantity || 1)
        }
        
        // If name or price is missing, fetch from database
        if (!fixedItem.name || !fixedItem.price) {
          console.log(`Fetching product data for ID: ${fixedItem.id}`)
          try {
            const { data: product, error } = await supabase
              .from('products')
              .select('name, price')
              .eq('id', fixedItem.id)
              .single()
            
            if (error) {
              console.error('Error fetching product:', error)
            } else if (product) {
              fixedItem.name = fixedItem.name || product.name
              fixedItem.price = fixedItem.price || Number(product.price)
              console.log(`Fetched product data:`, product)
            }
          } catch (error) {
            console.error('Database lookup error:', error)
          }
        }
        
        console.log('Final fixed item:', JSON.stringify(fixedItem, null, 2))
        return fixedItem
      }))
    }

    // Validate required fields
    if (!transaction_details?.order_id || !transaction_details?.gross_amount) {
      console.error('Missing transaction details:', { transaction_details })
      return NextResponse.json(
        { error: 'Missing required transaction details' },
        { status: 400 }
      )
    }

    // Validate Midtrans config
    if (!midtransConfig.serverKey) {
      console.error('Missing MIDTRANS_SERVER_KEY')
      return NextResponse.json(
        { error: 'Payment configuration error' },
        { status: 500 }
      )
    }

    // Prepare Midtrans Snap request
    const snapRequest = {
      transaction_details: {
        order_id: transaction_details.order_id,
        gross_amount: parseInt(transaction_details.gross_amount.toString())
      },
      customer_details: customer_details || {
        first_name: 'Customer',
        email: 'customer@example.com',
        phone: '08123456789'
      },
      item_details: item_details || [],
      callbacks: {
        finish: callbacks?.finish || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        unfinish: callbacks?.unfinish || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending`,
        error: callbacks?.error || `${process.env.NEXT_PUBLIC_BASE_URL}/payment/error`,
      },
      credit_card: {
        secure: true
      }
    }

    console.log('Prepared Snap request:', JSON.stringify(snapRequest, null, 2))
    console.log('Using API URL:', `${midtransConfig.apiUrl}/snap/v1/transactions`)
    console.log('Using server key prefix:', midtransConfig.serverKey.substring(0, 15) + '...')
    
    const snapResponse = await fetch(`${midtransConfig.apiUrl}/snap/v1/transactions`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(midtransConfig.serverKey + ':').toString('base64')}`
      },
      body: JSON.stringify(snapRequest)
    })

    console.log('Midtrans response status:', snapResponse.status)
    console.log('Midtrans response headers:', Object.fromEntries(snapResponse.headers.entries()))

    if (!snapResponse.ok) {
      const errorText = await snapResponse.text()
      console.error('Midtrans Snap Error Response:', errorText)
      console.error('Response status:', snapResponse.status)
      console.error('Response headers:', Object.fromEntries(snapResponse.headers.entries()))
      
      let errorMessage = 'Failed to create payment token'
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.error_messages ? errorData.error_messages.join(', ') : errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }

    const snapData = await snapResponse.json()
    console.log('Midtrans success response:', snapData)

    return NextResponse.json({
      token: snapData.token,
      redirect_url: snapData.redirect_url
    })

  } catch (error) {
    console.error('Payment token creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
