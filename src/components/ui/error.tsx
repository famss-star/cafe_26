import { ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorDisplayProps {
  title?: string
  message?: string
  onRetry?: () => void
  showRetry?: boolean
  action?: ReactNode
}

export function ErrorDisplay({ 
  title = 'Terjadi Kesalahan', 
  message = 'Mohon coba lagi beberapa saat.', 
  onRetry,
  showRetry = true,
  action 
}: ErrorDisplayProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        {(action || (showRetry && onRetry)) && (
          <CardContent>
            {action || (
              <Button onClick={onRetry} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}

interface ErrorCardProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorCard({ 
  title = 'Error', 
  message = 'Something went wrong', 
  onRetry,
  className 
}: ErrorCardProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6 text-center">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{message}</p>
        {onRetry && (
          <Button size="sm" onClick={onRetry}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
