'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Coffee, Menu, X, ShoppingCart, User, LogIn, UserPlus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { CartSidebar } from '@/components/CartSidebar'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menu', href: '/menu' },
  { name: 'Tentang', href: '/about' },
  { name: 'Kontak', href: '/contact' },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const pathname = usePathname()
  const { user, isAuthenticated, signOut } = useAuth()
  const { getTotalItems, tableNumber } = useCartStore()

  useEffect(() => {
    // Update total items on client side to prevent hydration mismatch
    setTotalItems(getTotalItems())
  }, [getTotalItems])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-amber-600 rounded-lg transition-all duration-200 ease-out will-change-transform group-hover:bg-amber-700 group-hover:scale-105">
                <Coffee className="h-6 w-6 text-white transition-transform duration-200 ease-out group-hover:rotate-6" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 transition-colors duration-200 ease-out group-hover:text-amber-700">Kawa Leaves</h1>
                <p className="text-xs text-amber-700 -mt-1 transition-colors duration-200 ease-out group-hover:text-amber-800">Coffee</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-all duration-200 ease-out relative group will-change-transform',
                    isActivePath(item.href)
                      ? 'text-amber-700'
                      : 'text-gray-800 hover:text-amber-700 hover:scale-105'
                  )}
                >
                  {item.name}
                  <span className={cn(
                    'absolute -bottom-1 left-0 h-0.5 bg-amber-700 transition-all duration-200 ease-out',
                    isActivePath(item.href) 
                      ? 'w-full' 
                      : 'w-0 group-hover:w-full'
                  )} />
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Table Info */}
              {tableNumber && (
                <div className="hidden md:flex items-center space-x-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  <span>📍 Meja {tableNumber}</span>
                </div>
              )}
              
              {/* Cart Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative text-gray-800 hover:text-amber-700 transition-all duration-200 ease-out will-change-transform hover:scale-110"
              >
                <ShoppingCart className="h-5 w-5 transition-transform duration-200 ease-out" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className="hidden md:flex items-center space-x-3">
                  <Link
                    href="/dashboard/customer"
                    className="flex items-center space-x-2 text-sm font-medium text-gray-800 hover:text-amber-700 transition-all duration-200 ease-out hover:scale-105 group"
                  >
                    <User className="h-4 w-4 text-gray-800 group-hover:text-amber-700 transition-colors duration-200 ease-out" />
                    <span>{user.name || 'Dashboard'}</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-gray-800 hover:text-red-600 hover:scale-105 transition-all duration-200 ease-out"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth/login" className="text-gray-800 hover:text-amber-700">
                      <LogIn className="h-4 w-4 mr-2 text-gray-800 group-hover:text-amber-700" />
                      Login
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/auth/register" className="bg-amber-600 text-white hover:bg-amber-800">
                      <UserPlus className="h-4 w-4 mr-2 text-white" />
                      Daftar
                    </Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-gray-900" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-900" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 animate-slideInDown">
              <div className="space-y-4">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'block text-base font-medium transition-all duration-200 transform hover:translate-x-1',
                      isActivePath(item.href)
                        ? 'text-amber-600'
                        : 'text-gray-700 hover:text-amber-600'
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both',
                      animation: 'fadeInUp 200ms cubic-bezier(0.4, 0, 0.2, 1) both'
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-gray-200 animate-fadeInUp" style={{animationDelay: '100ms', animationFillMode: 'both'}}>
                  {isAuthenticated && user ? (
                    <div className="space-y-3">
                      <Link
                        href="/dashboard/customer"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 text-base font-medium text-gray-700 hover:text-amber-600 transition-all duration-200 transform hover:translate-x-1"
                      >
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="w-full justify-start text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-[1.02]"
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild 
                        className="w-full justify-center border-amber-600 text-amber-700 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                      >
                        <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="text-amber-700">
                          <LogIn className="h-4 w-4 mr-2 text-amber-700" />
                          Login
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        asChild 
                        className="w-full justify-center bg-amber-600 text-white hover:bg-amber-800 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                      >
                        <Link href="/auth/register" onClick={() => setIsMenuOpen(false)} className="text-white">
                          <UserPlus className="h-4 w-4 mr-2 text-white" />
                          Daftar
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
