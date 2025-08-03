import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './button'

interface ErrorDisplayProps {
  message: string
  onRetry?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export function ErrorDisplay({ message, onRetry, size = 'md' }: ErrorDisplayProps) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  }

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]} text-center animate-fadeInUp`}>
      <AlertCircle className={`${iconSizes[size]} text-red-500 mb-3 animate-bounce`} />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-4 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  )
}
