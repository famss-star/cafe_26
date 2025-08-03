import { useMutation } from '@tanstack/react-query'
import { CartItem } from '@/store/cartStore'

interface PaymentData {
  order_id: string
  amount: number
  items: CartItem[]
  customer_details?: {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
  }
}

interface MidtransResult {
  order_id: string
  status_code: string
  transaction_status: string
  transaction_id: string
  gross_amount: string
  payment_type: string
  [key: string]: unknown
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: {
        onSuccess?: (result: MidtransResult) => void
        onPending?: (result: MidtransResult) => void
        onError?: (result: MidtransResult) => void
        onClose?: () => void
      }) => void
    }
  }
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      const response = await fetch('/api/payment/create-snap-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: paymentData.order_id,
            gross_amount: paymentData.amount
          },
          customer_details: paymentData.customer_details,
          item_details: paymentData.items.map(item => ({
            id: item.product_id,
            price: item.product_price,
            quantity: item.quantity,
            name: item.product_name
          }))
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment')
      }
      
      return response.json()
    },
  })
}

export function useProcessPayment() {
  const { mutateAsync: createPayment } = useCreatePayment()
  
  return useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      // Load Midtrans Snap script if not already loaded
      if (!window.snap) {
        await loadMidtransScript()
      }
      
      // Create payment token
      const result = await createPayment(paymentData)
      
      if (!result.success || !result.token) {
        throw new Error('Failed to get payment token')
      }
      
      // Return promise that resolves when payment is completed
      return new Promise((resolve, reject) => {
        window.snap.pay(result.token, {
          onSuccess: (result) => {
            resolve(result)
          },
          onPending: (result) => {
            resolve(result)
          },
          onError: (result) => {
            reject(new Error((result as MidtransResult & { error_message?: string }).error_message || 'Payment failed'))
          },
          onClose: () => {
            reject(new Error('Payment cancelled'))
          }
        })
      })
    },
  })
}

function loadMidtransScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.snap) {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.src = process.env.MIDTRANS_IS_PRODUCTION === 'true' 
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
    
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Midtrans script'))
    
    document.head.appendChild(script)
  })
}
