// Midtrans configuration and utilities
export const midtransConfig = {
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  snapUrl: process.env.MIDTRANS_IS_PRODUCTION === 'true' 
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js',
  apiUrl: process.env.MIDTRANS_IS_PRODUCTION === 'true'
    ? 'https://api.midtrans.com'
    : 'https://api.sandbox.midtrans.com'
}

export interface MidtransSnapConfig {
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
  item_details?: Array<{
    id: string
    price: number
    quantity: number
    name: string
    category?: string
  }>
  callbacks?: {
    finish?: string
    unfinish?: string
    error?: string
  }
}

export function generateOrderId(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `ORDER-${timestamp}-${random}`
}

export function createSnapToken(config: MidtransSnapConfig) {
  return fetch('/api/payment/create-snap-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  }).then(res => res.json())
}

// Midtrans signature validation
export function validateSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  // Note: This is for server-side validation only
  if (typeof window !== 'undefined') {
    console.warn('Signature validation should only be done on the server side')
    return false
  }
  
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require('crypto')
  const hash = crypto
    .createHash('sha512')
    .update(orderId + statusCode + grossAmount + midtransConfig.serverKey)
    .digest('hex')
  
  return hash === signatureKey
}
