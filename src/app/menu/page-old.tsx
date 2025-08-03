'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, ShoppingCart, Clock, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/MainLayout'
import { MENU_ITEMS, MenuItem } from '@/lib/data/menu'
import toast from 'react-hot-toast'

// Categories for filtering
const categories: { value: string; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'non-coffee', label: 'Non-Coffee' },
  { value: 'food', label: 'Food' },
  { value: 'dessert', label: 'Dessert' }
]

const sortOptions = [
  { value: 'name', label: 'Name A-Z' },
  { value: 'price', label: 'Price Low-High' },
  { value: 'popular', label: 'Popular First' }
]

export default function MenuPage() {
  const [products] = useState<MenuItem[]>(MENU_ITEMS)
  const [filteredProducts, setFilteredProducts] = useState<MenuItem[]>(MENU_ITEMS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popular'>('name')
  const [isLoading, setIsLoading] = useState(false)

  const { getTotalItems, addItem, openCart, tableNumber } = useCartStore()

  // Filter and sort products
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory)
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        case 'popular':
          const aPopular = a.tags.includes('popular') || a.tags.includes('bestseller')
          const bPopular = b.tags.includes('popular') || b.tags.includes('bestseller')
          if (aPopular && !bPopular) return -1
          if (!aPopular && bPopular) return 1
          return a.name.localeCompare(b.name)
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, sortBy])

  const handleAddToCart = async (product: MenuItem) => {
    if (!product.is_available) {
      toast.error('Product is not available')
      return
    }

    if (!tableNumber) {
      toast.error('Silakan scan QR code meja terlebih dahulu')
      window.location.href = '/table'
      return
    }

    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      addItem({
        id: `cart-${Date.now()}`,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image,
        quantity: 1,
        customizations: {},
        notes: ''
      })

      toast.success(`${product.name} added to cart!`)
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
      minimumFractionDigits: 0,
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
      sweet: 'bg-pink-100 text-pink-800',
      refreshing: 'bg-cyan-100 text-cyan-800',
      creamy: 'bg-amber-100 text-amber-800'
    }
    return colors[tag] || 'bg-gray-100 text-gray-800'
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-800 to-amber-600 text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
            <p className="text-xl md:text-2xl opacity-90 mb-6">
              Discover our carefully crafted selection of premium coffee and delicious treats
            </p>
            
            {/* Table Info */}
            {tableNumber ? (
              <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6 inline-block">
                <p className="text-lg font-semibold">
                  📍 Meja {tableNumber}
                </p>
              </div>
            ) : (
              <div className="bg-red-500 bg-opacity-20 rounded-lg p-4 mb-6 inline-block">
                <p className="text-lg font-semibold">
                  ⚠️ Silakan scan QR code meja terlebih dahulu
                </p>
                <button 
                  onClick={() => window.location.href = '/table'}
                  className="mt-2 bg-white text-amber-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Scan QR Code Meja
                </button>
              </div>
            )}
            
            {/* Cart Button */}
            {getTotalItems() > 0 && (
              <Button
                onClick={openCart}
                className="bg-white text-amber-800 hover:bg-gray-100 font-semibold flex items-center gap-2 mx-auto"
              >
                <ShoppingCart className="w-5 h-5" />
                View Cart ({getTotalItems()})
              </Button>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter Controls */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'popular')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} items
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
                      }}
                    />
                    
                    {/* Availability Badge */}
                    {!product.is_available && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Badge variant="destructive" className="text-sm">
                          Unavailable
                        </Badge>
                      </div>
                    )}

                    {/* Popular/Featured Badge */}
                    {(product.tags.includes('popular') || product.tags.includes('bestseller')) && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-amber-500 text-white flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {product.tags.includes('bestseller') ? 'Bestseller' : 'Popular'}
                        </Badge>
                      </div>
                    )}

                    {/* Preparation Time */}
                    <div className="absolute top-3 right-3 bg-black bg-opacity-70 rounded-full px-2 py-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">{product.preparation_time}m</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    {/* Title and Description */}
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className={`text-xs ${getTagColor(tag)}`}
                          >
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            +{product.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Nutritional Info */}
                    {product.nutritional_info && (
                      <div className="text-xs text-gray-500 mb-3 flex gap-4">
                        <span>{product.nutritional_info.calories} cal</span>
                        {product.nutritional_info.caffeine && (
                          <span>{product.nutritional_info.caffeine}mg caffeine</span>
                        )}
                      </div>
                    )}

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-amber-600">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      
                      <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.is_available || isLoading}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        {isLoading ? 'Adding...' : 'Add'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No items found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  setSortBy('name')
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Popular Items Section */}
          {!searchTerm && !selectedCategory && (
            <section className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Items</h2>
                <p className="text-gray-600">Customer favorites you shouldn&apos;t miss</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products
                  .filter(item => item.tags.includes('popular') || item.tags.includes('bestseller'))
                  .slice(0, 4)
                  .map((product) => (
                    <div key={`popular-${product.id}`} className="bg-white rounded-lg shadow-sm p-4 text-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-full mx-auto mb-3"
                      />
                      <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{formatPrice(product.price)}</p>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        size="sm"
                        variant="outline"
                        className="text-amber-600 border-amber-600 hover:bg-amber-50"
                      >
                        Quick Add
                      </Button>
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
