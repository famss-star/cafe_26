'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAdminProtection } from '@/hooks/useRoleProtection'
import { GuestRedirect } from '@/components/GuestRedirect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Package, 
  QrCode, 
  Gift,
  Clock,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalProducts: number
  totalTables: number
  totalVouchers: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const { loading, hasAccess } = useAdminProtection()
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
    totalTables: 0,
    totalVouchers: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const ordersResponse = await fetch('/api/orders')
      const ordersData = await ordersResponse.json()
      const orders = ordersData.data || []

      // Fetch products
      const productsResponse = await fetch('/api/products')
      const productsData = await productsResponse.json()
      const products = productsData.data || []

      // Fetch tables
      const tablesResponse = await fetch('/api/tables')
      const tablesData = await tablesResponse.json()
      const tables = tablesData.data || []

      // Calculate stats
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter((order: any) => order.status === 'pending').length,
        completedOrders: orders.filter((order: any) => order.status === 'completed').length,
        totalProducts: products.length,
        totalTables: tables.length,
        totalVouchers: 0 // TODO: Implement vouchers API
      })

      // Set recent orders (last 5)
      setRecentOrders(orders.slice(0, 5))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  return (
    <GuestRedirect>
      {loading && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      )}

      {!loading && !hasAccess && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
              <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
              <Button asChild>
                <Link href="/dashboard/customer">Go to Customer Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && hasAccess && user && ['admin', 'owner', 'super_user'].includes(user.role) && (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrders} pending, {stats.completedOrders} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active menu items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tables</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTables}</div>
              <p className="text-xs text-muted-foreground">QR Code tables</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button asChild className="h-20 flex flex-col">
            <Link href="/dashboard/admin/orders">
              <ShoppingCart className="h-6 w-6 mb-2" />
              Manage Orders
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex flex-col">
            <Link href="/dashboard/admin/products">
              <Package className="h-6 w-6 mb-2" />
              Manage Products
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex flex-col">
            <Link href="/dashboard/admin/tables">
              <QrCode className="h-6 w-6 mb-2" />
              Manage Tables
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex flex-col">
            <Link href="/dashboard/admin/vouchers">
              <Gift className="h-6 w-6 mb-2" />
              Manage Vouchers
            </Link>
          </Button>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">Order #{order.order_number}</p>
                      <p className="text-sm text-gray-600">
                        Table {order.tables?.table_number} • Rp {order.total_amount?.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          order.status === 'completed' ? 'default' : 
                          order.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {order.status}
                      </Badge>
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/admin/orders/${order.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No recent orders</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
      )}
    </GuestRedirect>
  )
}
