'use client'

import { useState } from 'react'
import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProductCustomization } from '@/types'
import toast from 'react-hot-toast'

interface MidtransResult {
  order_id: string
  status_code: string
  transaction_status: string
  transaction_id: string
  gross_amount: string
  payment_type: string
  [key: string]: unknown
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart, tableNumber } = useCartStore()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Keranjang kosong')
      return
    }

    if (!tableNumber) {
      toast.error('Silakan pilih meja terlebih dahulu')
      return
    }

    setIsProcessing(true)
    
    // Calculate total price
    const total = getTotalPrice()
    
    console.log('=== STARTING CHECKOUT DEBUG ===')
    console.log('Cart items for payment:', items)
    console.log('Cart items length:', items.length)
    items.forEach((item, index) => {
      console.log(`Cart item ${index}:`, JSON.stringify(item, null, 2))
    })
    console.log('Total calculated:', total)
    
    try {
      // Get table ID
      const tableResponse = await fetch(`/api/tables/${tableNumber}`)
      if (!tableResponse.ok) {
        throw new Error('Meja tidak ditemukan')
      }
      const tableData = await tableResponse.json()

      // Prepare item details with proper format for Midtrans
      const itemDetails = items.map((item) => {
        console.log('Processing item:', item)
        const processedItem = {
          id: item.product_id,
          price: Number(item.product_price), // Use product_price from store
          quantity: item.quantity,
          name: item.product_name || `Product ${item.product_id}`, // Use product_name from store
        }
        console.log('Processed item details:', processedItem)
        return processedItem
      })
      
      console.log('Final item details array:', JSON.stringify(itemDetails, null, 2))
      
      // Verify total matches sum of items
      const calculatedTotal = itemDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      console.log('Calculated total from items:', calculatedTotal)
      console.log('Cart total:', total)

      const payloadToSend = {
        transaction_details: {
          order_id: `ORDER_${Date.now()}_${tableNumber}`,
          gross_amount: calculatedTotal,
        },
        customer_details: {
          first_name: 'Customer',
          last_name: `Table ${tableNumber}`,
          email: 'customer@example.com',
          phone: '08123456789',
        },
        item_details: itemDetails,
      }
      
      console.log('=== PAYLOAD TO SEND ===')
      console.log('Full payload:', JSON.stringify(payloadToSend, null, 2))

      // Create payment token for Midtrans
      const paymentResponse = await fetch('/api/payment/create-snap-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadToSend),
      })

      if (!paymentResponse.ok) {
        console.error('Payment API error:', await paymentResponse.text())
        
        // Temporary fallback: create order directly without payment
        console.log('Falling back to direct order creation...')
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
            notes: '',
            payment_status: 'pending',
            payment_method: 'pending',
          })
        })

        if (orderResponse.ok) {
          const orderResult = await orderResponse.json()
          const order = orderResult.data
          
          // Update order with midtrans_order_id for future webhook matching
          await fetch(`/api/orders/${order.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              midtrans_order_id: order.id
            })
          })
          
          toast.success(`Order berhasil dibuat! Order ID: ${order.order_number}\nCatatan: Pembayaran akan diproses secara manual`)
          clearCart()
          onClose()
          return
        }
        
        throw new Error('Gagal membuat token pembayaran')
      }

      const { token } = await paymentResponse.json()

      // Initialize Snap payment
      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: async (result: MidtransResult) => {
            // Create order after successful payment
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
                notes: '',
                payment_status: 'paid',
                payment_method: result.payment_type,
                transaction_id: result.transaction_id,
              })
            })

            if (!orderResponse.ok) {
              const error = await orderResponse.json()
              throw new Error(error.error || 'Gagal membuat pesanan')
            }

            const orderResult = await orderResponse.json()
            const order = orderResult.data
            
            toast.success(`Pembayaran berhasil! Order ID: ${order.order_number}`)
            clearCart()
            onClose()
          },
          onPending: (result: MidtransResult) => {
            console.log('Pending payment:', result)
            toast.success('Pembayaran sedang diproses. Silakan selesaikan pembayaran Anda.')
          },
          onError: (result: MidtransResult) => {
            console.log('Payment error:', result)
            toast.error('Pembayaran gagal. Silakan coba lagi.')
          },
          onClose: () => {
            toast.error('Pembayaran dibatalkan.')
          }
        })
      } else {
        throw new Error('Midtrans Snap tidak tersedia')
      }

    } catch (error) {
      console.error('Checkout error:', error)
      toast.error(error instanceof Error ? error.message : 'Gagal memproses pesanan')
    } finally {
      setIsProcessing(false)
    }
  }

  const getCustomizationText = (customization: ProductCustomization | Record<string, unknown>) => {
    const parts = []
    if (customization?.temperature) {
      parts.push(customization.temperature === 'hot' ? 'Panas' : 'Dingin')
    }
    if (customization?.sugar_level) {
      const sugarMap = {
        'no_sugar': 'Tanpa Gula',
        'less_sugar': 'Gula Sedikit',
        'original': 'Gula Normal'
      }
      parts.push(sugarMap[customization.sugar_level as keyof typeof sugarMap])
    }
    if (customization?.spice_level && customization.spice_level !== 'original') {
      parts.push('Pedas')
    }
    if (customization?.notes) {
      parts.push(`Note: ${customization.notes}`)
    }
    return parts.join(', ')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-200 ease-out z-40 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-200 ease-out will-change-transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center text-gray-900">
            <ShoppingBag className="h-5 w-5 mr-2 text-gray-900" />
            Keranjang Belanja
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-all duration-200 ease-out hover:scale-110 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6 transition-transform duration-200 ease-out hover:rotate-90" />
          </button>
        </div>

        {/* Table Info */}
        {tableNumber && (
          <div className="p-4 bg-amber-50 border-b">
            <p className="text-sm text-amber-800">
              Meja: <span className="font-semibold">{tableNumber}</span>
            </p>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Keranjang masih kosong</p>
              <p className="text-sm">Tambahkan produk untuk mulai memesan</p>
            </div>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="p-3 transition-all duration-200 ease-out hover:shadow-md hover:scale-[1.01]">
                <div className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-gray-800 mt-1">
                      {formatPrice(item.product_price)}
                    </p>
                    {item.customizations && getCustomizationText(item.customizations) && (
                      <p className="text-xs text-gray-700 mt-1">
                        {getCustomizationText(item.customizations)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 p-0 text-gray-900 transition-all duration-200 ease-out hover:scale-110"
                    >
                      <Minus className="h-3 w-3 text-gray-900" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center text-gray-900">
                      {item.quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 p-0 text-gray-900 transition-all duration-200 ease-out hover:scale-110"
                    >
                      <Plus className="h-3 w-3 text-gray-900" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-medium text-gray-900">
                    Subtotal: {formatPrice(item.product_price * item.quantity)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 ease-out hover:scale-105"
                  >
                    Hapus
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-xl font-bold text-amber-600">
                {formatPrice(getTotalPrice())}
              </span>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleCheckout}
                disabled={isProcessing || items.length === 0}
                className="w-full transition-all duration-200 ease-out hover:scale-[1.02] bg-amber-600 hover:bg-amber-700"
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {isProcessing ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </span>
                ) : (
                  'Checkout'
                )}
              </Button>

              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full text-gray-900 transition-all duration-200 ease-out hover:scale-[1.02]"
                disabled={items.length === 0}
              >
                Kosongkan Keranjang
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
