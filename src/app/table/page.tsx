'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QrCode, Scan, Coffee, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QRScanner } from '@/components/QRScanner'
import { useCartStore } from '@/store/cartStore'
import { MainLayout } from '@/components/layout/MainLayout'
import toast from 'react-hot-toast'

function TableSelectionContent() {
  const [showScanner, setShowScanner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setTableNumber, tableNumber } = useCartStore()

  // Check if table number is provided in URL (from QR scan)
  useEffect(() => {
    const tableFromUrl = searchParams.get('table')
    if (tableFromUrl && !isNaN(Number(tableFromUrl))) {
      handleTableSelection(Number(tableFromUrl))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const handleTableSelection = async (selectedTableNumber: number) => {
    setIsLoading(true)
    try {
      // Simulate API call to validate table
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTableNumber(selectedTableNumber)
      toast.success(`Meja ${selectedTableNumber} berhasil dipilih!`)
      
      // Redirect to menu after successful selection
      setTimeout(() => {
        router.push('/menu')
      }, 1500)
      
    } catch {
      toast.error('Gagal memilih meja. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleScanComplete = (scannedTableNumber: number) => {
    setShowScanner(false)
    handleTableSelection(scannedTableNumber)
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Memproses Pilihan Meja...
            </h3>
            <p className="text-gray-600">Mohon tunggu sebentar</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (tableNumber) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Meja Terpilih!
            </h2>
            <p className="text-gray-600 mb-6">
              Anda telah memilih <span className="font-semibold">Meja {tableNumber}</span>
            </p>
            <Button
              onClick={() => router.push('/menu')}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Lanjut ke Menu
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
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
            <Coffee className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Pilih Meja Anda
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Scan QR code pada meja untuk memulai pemesanan
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            
            {/* Scan QR Section */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="text-center">
                <QrCode className="h-20 w-20 text-amber-600 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Scan QR Code Meja
                </h2>
                <p className="text-gray-600 mb-6">
                  Setiap meja memiliki QR code unik. Scan untuk memilih meja dan mulai memesan.
                </p>
                
                <Button
                  onClick={() => setShowScanner(true)}
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white w-full md:w-auto"
                >
                  <Scan className="h-5 w-5 mr-2" />
                  Scan QR Code
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Cara Memesan di Kawa Leaves Coffee
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pilih Meja</h4>
                    <p className="text-gray-600">Scan QR code yang ada pada meja Anda</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pilih Menu</h4>
                    <p className="text-gray-600">Browse dan pilih menu favorit Anda</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Bayar Online</h4>
                    <p className="text-gray-600">Lakukan pembayaran cashless dengan mudah</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 text-amber-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Nikmati Pesanan</h4>
                    <p className="text-gray-600">Pesanan akan diantar langsung ke meja Anda</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Cashierless</h4>
                <p className="text-gray-600">
                  Tidak perlu antri di kasir. Pesan dan bayar langsung dari meja Anda.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Contactless</h4>
                <p className="text-gray-600">
                  Sistem tanpa kontak untuk kenyamanan dan keamanan Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Scanner Modal */}
        {showScanner && (
          <QRScanner
            isOpen={showScanner}
            onScan={handleScanComplete}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </MainLayout>
  )
}

export default function TableSelectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TableSelectionContent />
    </Suspense>
  )
}
