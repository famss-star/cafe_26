'use client'

import { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { Product, ProductCustomization } from '@/types'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import toast from 'react-hot-toast'

interface ProductCustomizationModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function ProductCustomizationModal({ product, isOpen, onClose }: ProductCustomizationModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [customization, setCustomization] = useState<ProductCustomization>({
    temperature: product.customization_options?.temperature || 'hot',
    sugar_level: product.customization_options?.sugar_level || 'original',
    spice_level: product.customization_options?.spice_level || 'original',
    notes: ''
  })

  const { addItem } = useCartStore()

  if (!isOpen) return null

  const handleAddToCart = () => {
    addItem(product, customization, quantity)
    toast.success(`${quantity}x ${product.name} ditambahkan ke keranjang`)
    onClose()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const totalPrice = product.price * quantity

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
          <CardTitle className="pr-8">{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
          <div className="text-xl font-bold text-amber-600">
            {formatPrice(product.price)}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Temperature Options */}
          {product.category === 'coffee' || product.category === 'tea' ? (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Suhu</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={customization.temperature === 'hot' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCustomization({ ...customization, temperature: 'hot' })}
                >
                  Panas
                </Button>
                <Button
                  variant={customization.temperature === 'ice' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCustomization({ ...customization, temperature: 'ice' })}
                >
                  Dingin
                </Button>
              </div>
            </div>
          ) : null}

          {/* Sugar Level */}
          {product.category === 'coffee' || product.category === 'tea' ? (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Tingkat Gula</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={customization.sugar_level === 'no_sugar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCustomization({ ...customization, sugar_level: 'no_sugar' })}
                >
                  Tanpa Gula
                </Button>
                <Button
                  variant={customization.sugar_level === 'less_sugar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCustomization({ ...customization, sugar_level: 'less_sugar' })}
                >
                  Gula Sedikit
                </Button>
                <Button
                  variant={customization.sugar_level === 'original' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCustomization({ ...customization, sugar_level: 'original' })}
                >
                  Normal
                </Button>
              </div>
            </div>
          ) : null}

          {/* Spice Level */}
          {product.category === 'food' ? (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Tingkat Pedas</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={customization.spice_level === 'original' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCustomization({ ...customization, spice_level: 'original' })}
                >
                  Normal
                </Button>
                <Button
                  variant={customization.spice_level === 'spicy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCustomization({ ...customization, spice_level: 'spicy' })}
                >
                  Pedas
                </Button>
              </div>
            </div>
          ) : null}

          {/* Notes */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Catatan Tambahan</h3>
            <textarea
              value={customization.notes || ''}
              onChange={(e) => setCustomization({ ...customization, notes: e.target.value })}
              placeholder="Tambahkan catatan khusus..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Jumlah</h3>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Total and Add to Cart */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total:</span>
              <span className="text-xl font-bold text-amber-600">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full"
              size="lg"
            >
              Tambah ke Keranjang
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
