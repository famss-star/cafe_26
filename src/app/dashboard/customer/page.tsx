'use client'

import { useState } from 'react'
import { User, ShoppingBag, Heart, Settings, LogOut, Coffee } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useCustomerProtection } from '@/hooks/useRoleProtection'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingPage } from '@/components/ui/loading'
import { NotFoundPage } from '@/components/ui/NotFoundPage'
import toast from 'react-hot-toast'

export default function CustomerDashboard() {
  const { user, signOut } = useAuth()
  const { loading, hasAccess } = useCustomerProtection()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recentOrders, setRecentOrders] = useState([])

  if (loading) {
    return <LoadingPage message="Memuat dashboard..." />
  }

  // If user is not authenticated (guest), show 404 content directly
  if (!user) {
    return <NotFoundPage showMenuLinks={true} showDecorations={true} />
  }

  // If user doesn't have customer access, show 404 content (same as guest)
  if (!hasAccess) {
    return <NotFoundPage showMenuLinks={true} showDecorations={true} />
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      toast.success('Berhasil logout')
      window.location.href = '/'
    } else {
      toast.error('Gagal logout')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Coffee className="h-8 w-8 text-amber-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Selamat datang, {user.name || user.email}</p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeInUp">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Actions */}
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer animate-fadeInUp" style={{animationDelay: '0ms', animationFillMode: 'both'}}>
            <Link href="/menu">
              <CardContent className="p-6 text-center">
                <Coffee className="h-8 w-8 text-amber-600 mx-auto mb-3 transition-transform duration-200 hover:scale-110" />
                <h3 className="font-semibold text-gray-900 mb-1">Pesan Sekarang</h3>
                <p className="text-sm text-gray-600">Lihat menu dan buat pesanan</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer animate-fadeInUp" style={{animationDelay: '50ms', animationFillMode: 'both'}}>
            <Link href="/dashboard/customer/orders">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="h-8 w-8 text-blue-600 mx-auto mb-3 transition-transform duration-200 hover:scale-110" />
                <h3 className="font-semibold text-gray-900 mb-1">Riwayat Pesanan</h3>
                <p className="text-sm text-gray-600">Lihat pesanan sebelumnya</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer animate-fadeInUp" style={{animationDelay: '100ms', animationFillMode: 'both'}}>
            <Link href="/dashboard/customer/favorites">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-3 transition-transform duration-200 hover:scale-110" />
                <h3 className="font-semibold text-gray-900 mb-1">Favorit</h3>
                <p className="text-sm text-gray-600">Menu favorit Anda</p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer animate-fadeInUp" style={{animationDelay: '150ms', animationFillMode: 'both'}}>
            <Link href="/dashboard/customer/profile">
              <CardContent className="p-6 text-center">
                <Settings className="h-8 w-8 text-gray-600 mx-auto mb-3 transition-transform duration-200 hover:scale-110" />
                <h3 className="font-semibold text-gray-900 mb-1">Pengaturan</h3>
                <p className="text-sm text-gray-600">Kelola profil Anda</p>
              </CardContent>
            </Link>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Pesanan Terbaru
              </CardTitle>
              <CardDescription>
                Pesanan Anda yang paling baru
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Belum ada pesanan</p>
                  <p className="text-sm text-gray-400 mb-4">Mulai pesan untuk melihat riwayat di sini</p>
                  <Button asChild>
                    <Link href="/menu">Pesan Sekarang</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Order items will be mapped here */}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profil Saya
              </CardTitle>
              <CardDescription>
                Informasi akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nama</label>
                <p className="text-gray-900">{user.name || 'Belum diisi'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Telepon</label>
                <p className="text-gray-900">{user.phone || 'Belum diisi'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Member Sejak</label>
                <p className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <Button asChild className="w-full">
                <Link href="/dashboard/customer/profile">
                  Edit Profil
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Mulai Memesan</CardTitle>
            <CardDescription>
              Cara mudah untuk memesan di Kawa Leaves Coffee
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-amber-600">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Pilih Menu</h3>
                <p className="text-sm text-gray-600">Browse menu kami dan pilih item favorit Anda</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-amber-600">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Customize</h3>
                <p className="text-sm text-gray-600">Sesuaikan pesanan dengan preferensi Anda</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-amber-600">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Bayar</h3>
                <p className="text-sm text-gray-600">Bayar dengan mudah melalui berbagai metode</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Button asChild size="lg">
                <Link href="/menu">
                  Mulai Pesan Sekarang
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
