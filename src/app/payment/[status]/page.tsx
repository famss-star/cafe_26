'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type PaymentStatus = 'success' | 'pending' | 'error'

interface OrderInfo {
  order_id?: string
  order_number?: string
  transaction_id?: string
  amount?: number
  total_amount?: number
  tables?: {
    table_number?: string
  }
  [key: string]: unknown
}

export default function PaymentStatusPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<PaymentStatus>('pending')
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null)
  
  const orderId = searchParams.get('order_id')
  // const transactionStatus = searchParams.get('transaction_status')
  const transactionId = searchParams.get('transaction_id')

  useEffect(() => {
    // Determine status from URL or query params
    const pathname = window.location.pathname
    if (pathname.includes('/payment/success')) {
      setStatus('success')
    } else if (pathname.includes('/payment/pending')) {
      setStatus('pending')
    } else if (pathname.includes('/payment/error')) {
      setStatus('error')
    }

    // Fetch order information if orderId is available
    if (orderId) {
      fetchOrderInfo(orderId)
    }
  }, [orderId])

  const fetchOrderInfo = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrderInfo(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch order info:', error)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500" />
      case 'error':
        return <XCircle className="h-16 w-16 text-red-500" />
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case 'success':
        return 'Pembayaran Berhasil!'
      case 'pending':
        return 'Pembayaran Sedang Diproses'
      case 'error':
        return 'Pembayaran Gagal'
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return 'Terima kasih! Pesanan Anda telah berhasil dibayar dan sedang diproses.'
      case 'pending':
        return 'Pembayaran Anda sedang diverifikasi. Mohon tunggu konfirmasi.'
      case 'error':
        return 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'pending':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className={`max-w-md w-full ${getStatusColor()}`}>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          
          <h1 className="text-2xl font-bold mb-4">
            {getStatusTitle()}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {getStatusMessage()}
          </p>

          {orderInfo && (
            <div className="bg-white rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">Detail Pesanan:</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Order ID: {String(orderInfo.order_number || '')}</p>
                <p>Meja: {orderInfo.tables?.table_number || 'N/A'}</p>
                <p>Total: Rp {(orderInfo.total_amount || 0).toLocaleString()}</p>
                {transactionId && <p>Transaction ID: {transactionId}</p>}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {status === 'success' && (
              <>
                <Button 
                  onClick={() => window.location.href = '/menu'} 
                  className="w-full"
                >
                  Kembali ke Menu
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = `/orders/${orderId}`}
                  className="w-full"
                >
                  Lihat Status Pesanan
                </Button>
              </>
            )}
            
            {status === 'pending' && (
              <>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full"
                >
                  Refresh Status
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/menu'}
                  className="w-full"
                >
                  Kembali ke Menu
                </Button>
              </>
            )}
            
            {status === 'error' && (
              <>
                <Button 
                  onClick={() => window.location.href = '/menu'} 
                  className="w-full"
                >
                  Coba Lagi
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="w-full"
                >
                  Kembali ke Home
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
