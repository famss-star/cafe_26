// Monitoring and error tracking utilities
export interface SecurityEvent {
  type: 'rate_limit' | 'invalid_ip' | 'invalid_signature' | 'webhook_error' | 'auth_failure'
  ip: string
  userAgent?: string
  timestamp: string
  details?: Record<string, unknown>
}

export interface AuditLog {
  action: string
  user_id?: string
  ip: string
  resource?: string
  timestamp: string
  success: boolean
  details?: Record<string, unknown>
}

// Simple in-memory logging (in production, use external service like Sentry)
const securityEvents: SecurityEvent[] = []
const auditLogs: AuditLog[] = []

export function logSecurityEvent(event: SecurityEvent) {
  securityEvents.push(event)
  console.warn('🚨 Security Event:', event)
  
  // Keep only last 1000 events in memory
  if (securityEvents.length > 1000) {
    securityEvents.splice(0, securityEvents.length - 1000)
  }
}

export function logAuditEvent(log: AuditLog) {
  auditLogs.push(log)
  console.log('📋 Audit Log:', log)
  
  // Keep only last 1000 logs in memory
  if (auditLogs.length > 1000) {
    auditLogs.splice(0, auditLogs.length - 1000)
  }
}

export function getSecurityEvents(limit = 100): SecurityEvent[] {
  return securityEvents.slice(-limit)
}

export function getAuditLogs(limit = 100): AuditLog[] {
  return auditLogs.slice(-limit)
}

// Error tracking helper
export function trackError(error: Error, context?: Record<string, unknown>) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  }
  
  console.error('💥 Application Error:', errorInfo)
  
  // In production, send to error tracking service like Sentry
  // Sentry.captureException(error, { extra: context })
}

// Performance monitoring
export function measurePerformance<T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    const startTime = Date.now()
    
    try {
      const result = await operation()
      const duration = Date.now() - startTime
      
      console.log(`⚡ Performance: ${operationName} took ${duration}ms`)
      
      // In production, send to monitoring service
      resolve(result)
    } catch (error: unknown) {
      const duration = Date.now() - startTime
      console.error(`💥 Performance Error: ${operationName} failed after ${duration}ms`, error)
      reject(error)
    }
  })
}
