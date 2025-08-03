'use client'

import { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: ReactNode
  className?: string
  showNavbar?: boolean
  showFooter?: boolean
}

export function MainLayout({ 
  children, 
  className,
  showNavbar = true,
  showFooter = true 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      
      <main 
        className={cn(
          'flex-1 bg-white',
          showNavbar && 'pt-16', // Account for fixed navbar height
          className
        )}
      >
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  )
}
