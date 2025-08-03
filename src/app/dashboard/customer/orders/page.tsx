'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, CheckCircle, XCircle, Package, Receipt } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading'
import { ErrorDisplay } from '@/components/ui/error'
import { supabase } from '@/lib/supabase-client'
import { Order } from '@/types'

const statusConfig = {
  pending: {
    icon: Clock,
    label: 'Menunggu Konfirmasi',
    color: 'text-yellow-600 bg-yellow-50',
  },
  confirmed: {
    icon: CheckCircle,
    label: 'Dikonfirmasi',
    color: 'text-blue-600 bg-blue-50',
  },
  preparing: {
    icon: Package,
    label: 'Sedang Disiapkan',
    color: 'text-orange-600 bg-orange-50',
  },
  ready: {
    icon: CheckCircle,
    label: 'Siap Diambil',
    color: 'text-green-600 bg-green-50',
  },
  completed: {
    icon: CheckCircle,
    label: 'Selesai',
    color: 'text-green-600 bg-green-50',
  },
  cancelled: {
    icon: XCircle,
    label: 'Dibatalkan',
    color: 'text-red-600 bg-red-50',
  },
}

export default function CustomerOrders() {
  const { user, loading, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/auth/login?redirectTo=/dashboard/customer/orders'
    }
  }, [loading, isAuthenticated])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const fetchOrders = async () => {
    if (!user) return
    
    setOrdersLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Gagal memuat riwayat pesanan')
    } finally {
      setOrdersLoading(false)
    }
  }

  if (loading) {
    return <LoadingPage message="Memuat riwayat pesanan..." />
  }

  if (!isAuthenticated || !user) {
    return <ErrorDisplay title="Akses Ditolak" message="Silakan login terlebih dahulu" />
  }

  if (ordersLoading) {
    return <LoadingPage message="Memuat pesanan..." />
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Gagal Memuat Pesanan"
        message={error}
        action={
          <Button onClick={fetchOrders}>
            Coba Lagi
          </Button>
        }
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mr-4"
            >
              <Link href="/dashboard/customer">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Riwayat Pesanan</h1>
              <p className="text-sm text-gray-600">
                {orders.length} pesanan ditemukan
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Belum Ada Pesanan
              </h3>
              <p className="text-gray-600 mb-6">
                Anda belum pernah melakukan pesanan. Mulai pesan sekarang!
              </p>
              <Button asChild>
                <Link href="/menu">
                  Lihat Menu
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Clock
              const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending

              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Pesanan #{order.id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <CardDescription>
                          {new Date(order.created_at).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </CardDescription>
                      </div>
                      <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <StatusIcon className="h-4 w-4 mr-2" />
                        {statusInfo.label}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.order_items?.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                              {item.products?.image_url && (
                                <img
                                  src={item.products.image_url}
                                  alt={item.products.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {item.products?.name}
                              </h4>
                              <div className="text-sm text-gray-600 space-y-1">
                                {item.customizations && Object.keys(item.customizations).length > 0 && (
                                  <div>
                                    {Object.entries(item.customizations).map(([key, value]) => (
                                      <span key={key} className="inline-block mr-2">
                                        {key}: {String(value)}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {item.notes && (
                                  <div className="text-gray-500 italic">
                                    Catatan: {item.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {item.quantity}x
                              </div>
                              <div className="text-sm text-gray-600">
                                Rp {item.price.toLocaleString('id-ID')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Subtotal</span>
                          <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
                        </div>
                        {order.discount_amount && order.discount_amount > 0 && (
                          <div className="flex justify-between items-center mb-2 text-green-600">
                            <span>Diskon</span>
                            <span>-Rp {order.discount_amount.toLocaleString('id-ID')}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
                          <span>Total</span>
                          <span>Rp {order.total_amount.toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      {/* Table Info */}
                      {order.table_number && (
                        <div className="text-sm text-gray-600">
                          Meja: {order.table_number}
                        </div>
                      )}

                      {/* Payment Status */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-600">Status Pembayaran: </span>
                          <span className={
                            order.payment_status === 'success' 
                              ? 'text-green-600 font-medium'
                              : order.payment_status === 'pending'
                              ? 'text-yellow-600 font-medium'
                              : 'text-red-600 font-medium'
                          }>
                            {order.payment_status === 'success' ? 'Berhasil' :
                             order.payment_status === 'pending' ? 'Menunggu' : 'Gagal'}
                          </span>
                        </div>
                        
                        {order.status === 'pending' && order.payment_status === 'pending' && (
                          <Button size="sm" variant="outline">
                            Bayar Sekarang
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
