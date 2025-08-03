import { useState } from 'react'
import { Plus, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cartStore'
import { MenuItem } from '@/lib/data/menu'
import toast from 'react-hot-toast'

interface MenuCardProps {
  item: MenuItem
  onViewDetails?: (item: MenuItem) => void
}

export function MenuCard({ item, onViewDetails }: MenuCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const addToCart = useCartStore((state) => state.addItem)

  const handleAddToCart = async () => {
    if (!item.is_available) {
      toast.error('Item is currently unavailable')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      addToCart({
        id: `cart-${Date.now()}`,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        product_image: item.image,
        quantity: 1,
        customizations: {},
        notes: ''
      })

      toast.success(`${item.name} added to cart!`)
    } catch {
      toast.error('Failed to add item to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      popular: 'bg-red-100 text-red-800',
      bestseller: 'bg-green-100 text-green-800',
      signature: 'bg-purple-100 text-purple-800',
      new: 'bg-blue-100 text-blue-800',
      healthy: 'bg-emerald-100 text-emerald-800',
      spicy: 'bg-orange-100 text-orange-800',
      sweet: 'bg-pink-100 text-pink-800'
    }
    return colors[tag] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 ease-out will-change-transform group hover:shadow-lg hover:scale-[1.02]">
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
          }}
        />
        
        {/* Availability Badge */}
        {!item.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm animate-pulse">
              Unavailable
            </Badge>
          </div>
        )}

        {/* Popular/Featured Badge */}
        {(item.tags.includes('popular') || item.tags.includes('bestseller')) && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-amber-500 text-white flex items-center gap-1 shadow-lg animate-pulse-glow">
              <Star className="w-3 h-3" />
              {item.tags.includes('bestseller') ? 'Bestseller' : 'Popular'}
            </Badge>
          </div>
        )}

        {/* Quick Add Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 ease-out flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            onClick={handleAddToCart}
            disabled={!item.is_available || isLoading}
            className="transform scale-75 group-hover:scale-100 transition-transform duration-200 ease-out bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Quick Add
          </Button>
        </div>

        {/* Preparation Time */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-70 rounded-full px-2 py-1 flex items-center gap-1">
          <Clock className="w-3 h-3 text-white" />
          <span className="text-xs text-white">{item.preparation_time}m</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 transition-colors duration-200 ease-out group-hover:text-amber-700">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={`text-xs ${getTagColor(tag)} transition-transform duration-200 ease-out hover:scale-105`}
              >
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 transition-transform duration-200 ease-out hover:scale-105">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Nutritional Info */}
        {item.nutritional_info && (
          <div className="text-xs text-gray-500 mb-3 flex gap-4">
            <span className="transition-colors duration-200 ease-out hover:text-amber-600">{item.nutritional_info.calories} cal</span>
            {item.nutritional_info.caffeine && (
              <span className="transition-colors duration-200 ease-out hover:text-amber-600">{item.nutritional_info.caffeine}mg caffeine</span>
            )}
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-amber-600 transition-transform duration-200 ease-out group-hover:scale-105">
              {formatPrice(item.price)}
            </span>
          </div>

          <div className="flex gap-2">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(item)}
                className="text-xs transition-all duration-200 ease-out hover:scale-105 hover:border-amber-600 hover:text-amber-700"
              >
                Details
              </Button>
            )}
            
            <Button
              onClick={handleAddToCart}
              disabled={!item.is_available || isLoading}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1 transition-all duration-200 ease-out hover:scale-105"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4 transition-transform duration-200 ease-out group-hover:rotate-90" />
              )}
              {isLoading ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
