import { useCreateOrder } from '@/hooks/useOrders'
import { useProcessPayment } from '@/hooks/usePayment'
import { useCartStore } from '@/store/cartStore'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface CheckoutData {
  customer_details?: {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
  }
  notes?: string
}

export function useCheckout() {
  const { items, tableNumber, clearCart } = useCartStore()
  const createOrder = useCreateOrder()
  const processPayment = useProcessPayment()

  return useMutation({
    mutationFn: async (checkoutData: CheckoutData) => {
      if (!tableNumber) {
        throw new Error('Silakan pilih meja terlebih dahulu')
      }

      if (items.length === 0) {
        throw new Error('Keranjang belanja kosong')
      }

      // Step 1: Get table ID from table number
      const tableResponse = await fetch(`/api/tables/${tableNumber}`)
      if (!tableResponse.ok) {
        throw new Error('Meja tidak ditemukan')
      }
      const tableData = await tableResponse.json()
      const tableId = tableData.data.id

      // Step 2: Calculate total amount
      const totalAmount = items.reduce((sum, item) => 
        sum + (item.product_price * item.quantity), 0
      )

      // Step 3: Create order in database
      const orderResult = await createOrder.mutateAsync({
        table_id: tableId,
        items: items,
        customer_details: checkoutData.customer_details,
        notes: checkoutData.notes
      })

      if (!orderResult.success) {
        throw new Error('Gagal membuat pesanan')
      }

      const order = orderResult.data

      // Step 4: Process payment with Midtrans
      const paymentResult = await processPayment.mutateAsync({
        order_id: order.order_number,
        amount: totalAmount,
        items: items,
        customer_details: checkoutData.customer_details
      })

      // Step 5: Update order with payment info
      await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_status: 'paid',
          midtrans_transaction_id: (paymentResult as { transaction_id?: string }).transaction_id
        })
      })

      return {
        order,
        payment: paymentResult
      }
    },
    onSuccess: (result) => {
      clearCart()
      toast.success('Pesanan berhasil dibuat!')
      
      // Redirect to order success page
      window.location.href = `/orders/${result.order.id}/success`
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memproses pesanan')
    }
  })
}

// Simplified checkout for guest users
export function useGuestCheckout() {
  const { items, tableNumber, clearCart } = useCartStore()

  return useMutation({
    mutationFn: async (checkoutData: CheckoutData) => {
      if (!tableNumber) {
        throw new Error('Silakan pilih meja terlebih dahulu')
      }

      if (items.length === 0) {
        throw new Error('Keranjang belanja kosong')
      }

      // Get table ID
      const tableResponse = await fetch(`/api/tables/${tableNumber}`)
      if (!tableResponse.ok) {
        throw new Error('Meja tidak ditemukan')
      }
      const tableData = await tableResponse.json()

      // Calculate total
      const totalAmount = items.reduce((sum, item) => 
        sum + (item.product_price * item.quantity), 0
      )

      // Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_id: tableData.data.id,
          items: items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            customizations: item.customizations
          })),
          customer_details: checkoutData.customer_details,
          notes: checkoutData.notes
        })
      })

      if (!orderResponse.ok) {
        const error = await orderResponse.json()
        throw new Error(error.error || 'Gagal membuat pesanan')
      }

      const orderResult = await orderResponse.json()
      const order = orderResult.data

      // Create payment token
      const paymentResponse = await fetch('/api/payment/create-snap-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: order.order_number,
            gross_amount: totalAmount
          },
          customer_details: checkoutData.customer_details,
          item_details: items.map(item => ({
            id: item.product_id,
            price: item.product_price,
            quantity: item.quantity,
            name: item.product_name
          })),
          callbacks: {
            finish: `${window.location.origin}/payment/success?order_id=${order.id}`,
            unfinish: `${window.location.origin}/payment/pending?order_id=${order.id}`,
            error: `${window.location.origin}/payment/error?order_id=${order.id}`
          }
        })
      })

      if (!paymentResponse.ok) {
        throw new Error('Gagal membuat token pembayaran')
      }

      const paymentResult = await paymentResponse.json()

      return {
        order,
        payment_token: paymentResult.token,
        payment_url: paymentResult.redirect_url
      }
    },
    onSuccess: (result) => {
      clearCart()
      
      // Redirect to Midtrans payment page
      if (result.payment_url) {
        window.location.href = result.payment_url
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memproses pesanan')
    }
  })
}
