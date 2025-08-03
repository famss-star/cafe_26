'use client'

import { useState } from 'react'
import { QrCode, Coffee, Users, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'

export default function HomePage() {
  const [tableNumber, setTableNumber] = useState('')

  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tableNumber.trim()) {
      window.location.href = `/menu?table=${tableNumber}`
    }
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-amber-50 to-orange-100">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 transition-colors duration-200 ease-out hover:text-amber-700">
              Welcome to Kawa Leaves Coffee
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience our cashierless ordering system. Scan the QR code at your table or enter your table number to start ordering.
            </p>
          </div>

          {/* QR Scanner / Table Input */}
          <div className="max-w-md mx-auto mb-16">
            <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-200 ease-out hover:shadow-xl hover:scale-[1.02]">
              <div className="text-center mb-6">
                <QrCode className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Order</h3>
                <p className="text-gray-600">Enter your table number to begin</p>
              </div>
              
              <form onSubmit={handleTableSubmit} className="space-y-4">
                <div>
                  <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Table Number
                  </label>
                  <input
                    type="text"
                    id="tableNumber"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g., 5, A3, B12"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 ease-out"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-all duration-200 ease-out font-medium hover:scale-[1.02]"
                >
                  Start Ordering
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-3">Or browse our menu directly</p>
                <Link
                  href="/menu"
                  className="inline-block text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 ease-out hover:scale-105"
                >
                  View Full Menu →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 transition-colors duration-200 ease-out hover:text-amber-700">Why Choose Kawa Leaves?</h2>
              <p className="text-lg text-gray-600">Modern technology meets exceptional coffee</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 rounded-lg border border-gray-200 transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02]">
                <QrCode className="h-12 w-12 text-amber-600 mx-auto mb-4 transition-transform duration-200 ease-out hover:scale-110" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Ordering</h3>
                <p className="text-gray-600">Simply scan and order from your table</p>
              </div>
              
              <div className="text-center p-6 rounded-lg border border-gray-200 transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02]">
                <CreditCard className="h-12 w-12 text-amber-600 mx-auto mb-4 transition-transform duration-200 ease-out hover:scale-110" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cashless Payment</h3>
                <p className="text-gray-600">Safe and secure online payments</p>
              </div>
              
              <div className="text-center p-6 rounded-lg border border-gray-200 transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02]">
                <Users className="h-12 w-12 text-amber-600 mx-auto mb-4 transition-transform duration-200 ease-out hover:scale-110" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Waiting</h3>
                <p className="text-gray-600">Skip the queue with our efficient system</p>
              </div>
              
              <div className="text-center p-6 rounded-lg border border-gray-200 transition-all duration-200 ease-out hover:shadow-lg hover:scale-[1.02]">
                <Coffee className="h-12 w-12 text-amber-600 mx-auto mb-4 transition-transform duration-200 ease-out hover:scale-110" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600">Freshly brewed coffee and delicious food</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-amber-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4 transition-transform duration-200 ease-out hover:scale-[1.02]">Ready to Experience the Future of Cafe?</h2>
            <p className="text-xl text-amber-100 mb-8">Join thousands of satisfied customers who love our innovative approach</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 ease-out hover:scale-[1.02]"
              >
                Browse Menu
              </Link>
              <Link
                href="/auth/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-amber-600 transition-all duration-200 ease-out hover:scale-[1.02]"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
