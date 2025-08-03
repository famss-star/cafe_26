import Link from 'next/link'

interface NotFoundPageProps {
  showBackButton?: boolean
  showMenuLinks?: boolean
  showDecorations?: boolean
}

export function NotFoundPage({ 
  showBackButton = false, 
  showMenuLinks = false, 
  showDecorations = false 
}: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Coffee Cup Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-orange-100 mb-6">
            <svg 
              className="h-12 w-12 text-orange-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7h3a2 2 0 012 2v6a2 2 0 01-2 2h-3m-3 7H5a2 2 0 01-2-2V5a2 2 0 012-2h11m0 0V9a2 2 0 012 2v6a2 2 0 01-2 2m0 0h.01"
              />
            </svg>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. 
            It might have been removed, had its name changed, or you don&apos;t have permission to access it.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              <svg 
                className="mr-2 h-5 w-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go Home
            </Link>
            
            {showBackButton && (
              <button
                onClick={() => window.history.back()}
                className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                <svg 
                  className="mr-2 h-5 w-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                  />
                </svg>
                Go Back
              </button>
            )}
            
            {showMenuLinks && (
              <div className="text-sm text-gray-500">
                <Link 
                  href="/menu" 
                  className="text-orange-600 hover:text-orange-500 transition-colors"
                >
                  Browse Menu
                </Link>
                <span className="mx-2">•</span>
                <Link 
                  href="/auth/login" 
                  className="text-orange-600 hover:text-orange-500 transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      {showDecorations && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-orange-300 rounded-full opacity-15 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-400 rounded-full opacity-10 animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-orange-500 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
      )}
    </div>
  )
}
