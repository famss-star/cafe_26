'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface GuestRedirectProps {
  children: React.ReactNode
  redirectTo?: string
}

export function GuestRedirect({ children, redirectTo = '/not-found' }: GuestRedirectProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      // If user is not authenticated (guest), redirect to specified page
      router.replace(redirectTo)
    }
  }, [user, loading, router, redirectTo])

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

  // If user is not authenticated, don't render children (will redirect)
  if (!user) {
    return null
  }

  // User is authenticated, render children
  return <>{children}</>
}
