'use client'

import { useAuth } from '@/hooks/useAuth'
import { useAdminProtection } from '@/hooks/useRoleProtection'
import { NotFoundPage } from '@/components/ui/NotFoundPage'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { loading, hasAccess } = useAdminProtection()

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated (guest), show 404 content directly
  if (!user) {
    return <NotFoundPage showMenuLinks={true} showDecorations={true} />
  }

  // If user doesn't have admin access, show 404 content (same as guest)
  if (!hasAccess) {
    return <NotFoundPage showMenuLinks={true} showDecorations={true} />
  }

  // Show admin dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.email}</p>
      </div>
    </div>
  )
}
