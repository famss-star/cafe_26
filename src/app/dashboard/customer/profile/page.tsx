'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, User, Mail, Phone, Calendar, Save } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { LoadingPage } from '@/components/ui/loading'
import { ErrorDisplay } from '@/components/ui/error'
import { supabase } from '@/lib/supabase-client'
import toast from 'react-hot-toast'

interface ProfileForm {
  name: string
  phone: string
  email: string
}

export default function CustomerProfile() {
  const { user, loading, isAuthenticated } = useAuth()
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: '',
    phone: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/auth/login?redirectTo=/dashboard/customer/profile'
    }
  }, [loading, isAuthenticated])

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }))
    setHasChanges(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileForm.name,
          phone: profileForm.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        throw error
      }

      toast.success('Profil berhasil diperbarui')
      setHasChanges(false)
      
      // Refresh page to update user data
      window.location.reload()
    } catch (err) {
      console.error('Error updating profile:', err)
      toast.error('Gagal memperbarui profil')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingPage message="Memuat profil..." />
  }

  if (!isAuthenticated || !user) {
    return <ErrorDisplay title="Akses Ditolak" message="Silakan login terlebih dahulu" />
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Profil</h1>
              <p className="text-sm text-gray-600">
                Kelola informasi akun Anda
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informasi Pribadi
              </CardTitle>
              <CardDescription>
                Perbarui informasi profil Anda di sini
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Masukkan nomor telepon"
                    className="pl-10"
                  />
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Email tidak dapat diubah. Hubungi support jika diperlukan.
                </p>
              </div>

              {/* Account Info */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Informasi Akun</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Member Sejak:</span>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {new Date(user.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {user.role === 'customer' ? 'Pelanggan' : user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={!hasChanges || isSubmitting}
                  className="min-w-32"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Additional Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pengaturan Lainnya</CardTitle>
            <CardDescription>
              Aksi tambahan untuk akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Ubah Password</h3>
                <p className="text-sm text-gray-600">Update password akun Anda</p>
              </div>
              <Button variant="outline" size="sm">
                Ubah Password
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Hapus Akun</h3>
                <p className="text-sm text-gray-600">Hapus akun secara permanen</p>
              </div>
              <Button variant="destructive" size="sm">
                Hapus Akun
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
