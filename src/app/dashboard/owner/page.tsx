'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useOwnerProtection } from '@/hooks/useRoleProtection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NotFoundPage } from '@/components/ui/NotFoundPage'
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Package, 
  QrCode, 
  Calendar,
  BarChart3,
  AlertTriangle,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface OwnerStats {
  totalRevenue: number
  totalUsers: number
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  totalProducts: number
  totalTables: number
  totalVouchers: number
  averageOrderValue: number
  dailyRevenue: number
  weeklyRevenue: number
  monthlyRevenue: number
}

export default function OwnerDashboard() {
  const { user } = useAuth()
  const { loading, hasAccess } = useOwnerProtection()
  const [stats, setStats] = useState<OwnerStats>({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalTables: 0,
    totalVouchers: 0,
    averageOrderValue: 0,
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    if (user && hasAccess) {
      fetchOwnerDashboardData()
    }
  }, [user, hasAccess])

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

  // If user doesn't have owner access, show 404 content (same as guest)
  if (!hasAccess) {
    return <NotFoundPage showMenuLinks={true} showDecorations={true} />
  }
  const fetchOwnerDashboardData = async () => {
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

      // Calculate revenue statistics
      const completedOrders = orders.filter((order: any) => order.status === 'completed')
      const totalRevenue = completedOrders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0)
      
      // Calculate time-based revenue
      const today = new Date()
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const startOfWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

      const dailyRevenue = completedOrders
        .filter((order: any) => new Date(order.created_at) >= startOfDay)
        .reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0)

      const weeklyRevenue = completedOrders
        .filter((order: any) => new Date(order.created_at) >= startOfWeek)
        .reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0)

      const monthlyRevenue = completedOrders
        .filter((order: any) => new Date(order.created_at) >= startOfMonth)
        .reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0)

      const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0

      setStats({
        totalRevenue,
        totalUsers: 0, // TODO: Implement users count API
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        pendingOrders: orders.filter((order: any) => order.status === 'pending').length,
        totalProducts: products.length,
        totalTables: tables.length,
        totalVouchers: 0, // TODO: Implement vouchers API
        averageOrderValue,
        dailyRevenue,
        weeklyRevenue,
        monthlyRevenue
      })

      // Set recent orders (last 10)
      setRecentOrders(orders.slice(0, 10))
    } catch (error) {
      console.error('Error fetching owner dashboard data:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !['owner', 'super_user'].includes(user.role)) {
    return (
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600">Business overview and analytics for {user.email}</p>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {stats.totalRevenue.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">
                Avg: Rp {stats.averageOrderValue.toLocaleString('id-ID')} per order
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {stats.monthlyRevenue.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {stats.weeklyRevenue.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {stats.dailyRevenue.toLocaleString('id-ID')}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Business Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedOrders} completed, {stats.pendingOrders} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered customers</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Button asChild className="h-20 flex flex-col">
            <Link href="/dashboard/admin">
              <Eye className="h-6 w-6 mb-2" />
              Admin View
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex flex-col">
            <Link href="/dashboard/admin/orders">
              <ShoppingCart className="h-6 w-6 mb-2" />
              View Orders
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
            <Link href="/dashboard/owner/analytics">
              <BarChart3 className="h-6 w-6 mb-2" />
              Analytics
            </Link>
          </Button>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
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
                      <p className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleString('id-ID')}
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
                      <Badge 
                        variant={
                          order.payment_status === 'paid' ? 'default' : 
                          order.payment_status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {order.payment_status}
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
  )
}
