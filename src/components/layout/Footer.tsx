import Link from 'next/link'
import { Coffee, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react'

const footerNavigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Kontak', href: '/contact' },
  ],
  customer: [
    { name: 'Cara Pesan', href: '/help/order' },
    { name: 'FAQ', href: '/help/faq' },
    { name: 'Kebijakan Privasi', href: '/privacy' },
    { name: 'Syarat & Ketentuan', href: '/terms' },
  ],
  social: [
    {
      name: 'Facebook',
      href: 'https://facebook.com/kawaleaves',
      icon: Facebook,
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/kawaleaves',
      icon: Instagram,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/kawaleaves',
      icon: Twitter,
    },
  ],
}

const contactInfo = [
  {
    icon: MapPin,
    label: 'Alamat',
    value: 'Jl. Kopi Arabica No. 123, Jakarta Selatan 12345',
  },
  {
    icon: Phone,
    label: 'Telepon',
    value: '+62 21 1234 5678',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@kawaleaves.com',
  },
  {
    icon: Clock,
    label: 'Jam Buka',
    value: 'Senin - Minggu: 07:00 - 22:00',
  },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-amber-600 rounded-lg">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Kawa Leaves</h3>
                <p className="text-sm text-amber-400">Coffee</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-6 max-w-sm">
              Nikmati pengalaman kopi terbaik dengan sistem pemesanan QR code yang modern dan praktis. 
              Kualitas premium, layanan terdepan.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              {footerNavigation.social.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{item.name}</span>
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-3">
              {footerNavigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-amber-400 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Bantuan</h3>
            <ul className="space-y-3">
              {footerNavigation.customer.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-amber-400 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label} className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-300">{item.value}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
              <p className="text-gray-300 text-sm">
                Dapatkan update menu terbaru dan promo spesial langsung di email Anda.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Kawa Leaves Coffee. All rights reserved.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-amber-400 text-sm transition-colors"
              >
                Cookies Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
