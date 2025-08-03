'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, ShoppingCart, Clock, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useProducts, useCategories } from '@/hooks/useApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/MainLayout'
import { Database } from '@/types/database.types'
import toast from 'react-hot-toast'

type Product = Database['public']['Tables']['products']['Row']

function MenuContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  
  const searchParams = useSearchParams()
  const { getTotalItems, addItem, openCart, tableNumber, setTableNumber } = useCartStore()

  // Set table number from URL parameter if available
  useEffect(() => {
    const tableParam = searchParams.get('table')
    if (tableParam && !tableNumber) {
      setTableNumber(parseInt(tableParam))
      toast.success(`Meja ${tableParam} dipilih`)
    }
  }, [searchParams, tableNumber, setTableNumber])

  // Fetch data from Supabase
  const { 
    data: products = [], 
    isLoading: productsLoading, 
    error: productsError 
  } = useProducts()

  const { 
    data: categories = [], 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useCategories()

  // Check if table is selected
  if (!tableNumber) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Pilih Meja Terlebih Dahulu
            </h2>
            <p className="text-gray-600 mb-6">
              Silakan scan QR code di meja Anda untuk mulai memesan
            </p>
            <Link
              href="/table"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-block"
            >
              Scan QR Code Meja
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || product.category_id === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleAddToCart = async (product: Product) => {
    try {
      addItem({
        id: `${product.id}-${Date.now()}`,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image_url || '/images/placeholder.jpg',
        quantity: 1,
        customizations: {}
      })
      
      toast.success(`${product.name} ditambahkan ke keranjang`)
    } catch {
      toast.error('Gagal menambahkan ke keranjang')
    }
  }

  // Loading states
  if (productsLoading || categoriesLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12 animate-fade-in-up">
            <Loader2 className="h-8 w-8 animate-spin mr-3 text-amber-600" />
            <span className="text-gray-700">Memuat menu...</span>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Error states
  if (productsError || categoriesError) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Gagal Memuat Menu
            </h2>
            <p className="text-gray-600 mb-6">
              Terjadi kesalahan saat memuat data menu. Silakan refresh halaman.
            </p>
            <Button onClick={() => window.location.reload()} className="hover:shadow-lg transition-all duration-300">
              Refresh Halaman
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Table Info Header */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 transition-all duration-200 ease-out hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-amber-800">Meja {tableNumber}</h3>
              <p className="text-sm text-amber-600">Silakan pilih menu yang Anda inginkan</p>
            </div>
            <Badge variant="outline" className="bg-amber-100 text-amber-800">
              Aktif
            </Badge>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 transition-colors duration-200 ease-out hover:text-amber-700">Menu Kawa Leaves</h1>
          <p className="text-gray-600">Nikmati koleksi kopi premium dan hidangan lezat kami</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Cari menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-gray-800 transition-all duration-200 ease-out focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('')}
              size="sm"
              className={`transition-all duration-200 ease-out ${selectedCategory === '' ? '' : 'text-gray-800'}`}
            >
              Semua Menu
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                size="sm"
                className={`transition-all duration-200 ease-out ${selectedCategory === category.id ? '' : 'text-gray-800'}`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex justify-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-gray-800 transition-all duration-200 ease-out hover:shadow-md"
            >
              <option value="name" className="text-gray-800">Urutkan: Nama A-Z</option>
              <option value="price" className="text-gray-800">Urutkan: Harga Terendah</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Menampilkan {filteredProducts.length} dari {products.length} menu
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02] animate-fadeInUp"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <img
                  src={product.image_url || '/images/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg'
                  }}
                />
                {product.is_available ? (
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    Tersedia
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    Habis
                  </Badge>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-900 transition-colors duration-200 ease-out hover:text-amber-700">{product.name}</h3>
                <p className="text-gray-800 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-amber-600">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>5-10 menit</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.is_available}
                  className="w-full"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {product.is_available ? 'Tambah ke Keranjang' : 'Tidak Tersedia'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              Tidak ada menu yang ditemukan
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
              }}
              variant="outline"
            >
              Hapus Filter
            </Button>
          </div>
        )}

        {/* Cart Button */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-6 right-6">
            <Button
              onClick={openCart}
              size="lg"
              className="rounded-full shadow-lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {getTotalItems()} Item
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuContent />
    </Suspense>
  )
}
