'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Coffee, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TablePage() {
  const params = useParams()
  const router = useRouter()
  const { setTableNumber } = useCartStore()
  
  const tableNumber = params.tableNumber ? Number(params.tableNumber) : null

  useEffect(() => {
    if (tableNumber && !isNaN(tableNumber)) {
      // Auto-select table when accessing via QR code
      setTableNumber(tableNumber)
      toast.success(`Meja ${tableNumber} berhasil dipilih!`)
    } else {
      // Redirect to table selection if invalid table number
      router.push('/table')
    }
  }, [tableNumber, setTableNumber, router])

  if (!tableNumber || isNaN(tableNumber)) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memproses...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-800 to-amber-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Selamat Datang!
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-6">
              Anda telah memilih Meja {tableNumber}
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            
            {/* Table Info */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <Coffee className="h-16 w-16 text-amber-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Meja {tableNumber}
              </h2>
              <p className="text-gray-600 mb-6">
                Terima kasih telah memilih Kawa Leaves Coffee! 
                Siap untuk menikmati pengalaman coffee shop yang luar biasa?
              </p>
              
              <Button
                onClick={() => router.push('/menu')}
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Mulai Memesan
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Menu Lengkap</h4>
                <p className="text-gray-600 text-sm">
                  Kopi premium, makanan lezat, dan dessert yang menggoda
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Pembayaran Mudah</h4>
                <p className="text-gray-600 text-sm">
                  Bayar cashless dengan berbagai metode pembayaran
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Pelayanan Cepat</h4>
                <p className="text-gray-600 text-sm">
                  Pesanan langsung diantar ke meja Anda
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Aksi Cepat
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => router.push('/menu?category=coffee')}
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50"
                >
                  Lihat Menu Kopi
                </Button>
                <Button
                  onClick={() => router.push('/menu?category=food')}
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50"
                >
                  Lihat Menu Makanan
                </Button>
                <Button
                  onClick={() => router.push('/menu?popular=true')}
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50"
                >
                  Menu Populer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
