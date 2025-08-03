'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { NotFoundPage } from '@/components/ui/NotFoundPage'
import { 
  Shield,
  Database,
  Server,
  Users,
  Settings,
  Activity,
  Eye,
  UserCog,
  BarChart3,
  FileText,
  Terminal,
  Globe,
  Lock
} from 'lucide-react'
import Link from 'next/link'

interface SuperUserStats {
  totalUsers: number
  totalAdmins: number
  totalOwners: number
  totalCustomers: number
  systemHealth: 'healthy' | 'warning' | 'error'
  databaseSize: string
  serverUptime: string
  activeConnections: number
}

export default function SuperUserDashboard() {
  const { user, loading } = useAuth()
  const [stats, setStats] = useState<SuperUserStats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalOwners: 0,
    totalCustomers: 0,
    systemHealth: 'healthy',
    databaseSize: '0 MB',
    serverUptime: '0 days',
    activeConnections: 0
  })
  const [systemLogs, setSystemLogs] = useState<any[]>([])

  useEffect(() => {
    fetchSuperUserDashboardData()
  }, [])

  const fetchSuperUserDashboardData = async () => {
    try {
      // TODO: Implement super user specific APIs
      // For now, using mock data
      setStats({
        totalUsers: 150,
        totalAdmins: 5,
        totalOwners: 2,
        totalCustomers: 143,
        systemHealth: 'healthy',
        databaseSize: '2.3 GB',
        serverUptime: '30 days',
        activeConnections: 24
      })

      // Mock system logs
      setSystemLogs([
        {
          id: 1,
          type: 'info',
          message: 'User authentication successful',
          timestamp: new Date().toISOString(),
          source: 'Auth Service'
        },
        {
          id: 2,
          type: 'warning',
          message: 'High database connection usage detected',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          source: 'Database Monitor'
        },
        {
          id: 3,
          type: 'error',
          message: 'Payment webhook failed for order #12345',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          source: 'Payment Service'
        }
      ])
    } catch (error) {
      console.error('Error fetching super user dashboard data:', error)
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

  if (!user || user.role !== 'super_user') {
    return <NotFoundPage showMenuLinks={true} showDecorations={true} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Super User Dashboard</h1>
              <p className="text-gray-600">System administration and monitoring for {user.email}</p>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={
                    stats.systemHealth === 'healthy' ? 'default' : 
                    stats.systemHealth === 'warning' ? 'secondary' : 'destructive'
                  }
                >
                  {stats.systemHealth.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database Size</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.databaseSize}</div>
              <p className="text-xs text-muted-foreground">Supabase PostgreSQL</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Uptime</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.serverUptime}</div>
              <p className="text-xs text-muted-foreground">Vercel deployment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeConnections}</div>
              <p className="text-xs text-muted-foreground">Real-time users</p>
            </CardContent>
          </Card>
        </div>

        {/* User Management Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <UserCog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Customer accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAdmins}</div>
              <p className="text-xs text-muted-foreground">Admin accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Owners</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOwners}</div>
              <p className="text-xs text-muted-foreground">Owner accounts</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Button asChild className="h-20 flex flex-col">
            <Link href="/dashboard/owner">
              <Eye className="h-6 w-6 mb-2" />
              Owner View
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex flex-col">
            <Link href="/dashboard/super/users">
              <Users className="h-6 w-6 mb-2" />
              Manage Users
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex flex-col">
            <Link href="/dashboard/super/logs">
              <FileText className="h-6 w-6 mb-2" />
              System Logs
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex flex-col">
            <Link href="/dashboard/super/database">
              <Database className="h-6 w-6 mb-2" />
              Database
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex flex-col">
            <Link href="/dashboard/super/analytics">
              <BarChart3 className="h-6 w-6 mb-2" />
              Analytics
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="h-20 flex flex-col">
            <Link href="/dashboard/super/settings">
              <Settings className="h-6 w-6 mb-2" />
              System Settings
            </Link>
          </Button>
        </div>

        {/* System Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Recent System Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {systemLogs.length > 0 ? (
              <div className="space-y-4">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant={
                            log.type === 'info' ? 'default' : 
                            log.type === 'warning' ? 'secondary' : 'destructive'
                          }
                        >
                          {log.type.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600">{log.source}</span>
                      </div>
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No recent logs</p>
            )}
            <div className="mt-4 flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/super/logs">View All Logs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
