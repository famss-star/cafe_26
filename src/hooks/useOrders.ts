import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Database } from '@/types/database.types'
import { CartItem } from '@/store/cartStore'

type Order = Database['public']['Tables']['orders']['Row']

interface CreateOrderData {
  table_id: string
  items: CartItem[]
  customer_details?: {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
  }
  notes?: string
}

// Orders hooks
export function useOrders(userId?: string, status?: string) {
  return useQuery({
    queryKey: ['orders', userId, status],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (userId) params.set('user_id', userId)
      if (status) params.set('status', status)
      
      const response = await fetch(`/api/orders?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      return data.data as Order[]
    },
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create order')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string, status: string }) => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update order status')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
