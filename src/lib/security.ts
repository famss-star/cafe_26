// Security utility functions
import Joi from 'joi'

// Input sanitization
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>\"']/g, '')
}

// Validate order ID format
export function validateOrderId(orderId: string): boolean {
  const orderIdPattern = /^ORDER-\d{13}-\d{1,4}$/
  return orderIdPattern.test(orderId)
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

// Validate phone number (Indonesian format)
export function validatePhone(phone: string): boolean {
  const phonePattern = /^(\+62|62|0)[0-9]{9,13}$/
  return phonePattern.test(phone.replace(/[\s-]/g, ''))
}

// Rate limiting helper
export function createRateLimiter(limit: number, windowMs: number) {
  const requests = new Map()
  
  return (identifier: string): boolean => {
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!requests.has(identifier)) {
      requests.set(identifier, [])
    }
    
    const userRequests = requests.get(identifier)
    const validRequests = userRequests.filter((time: number) => time > windowStart)
    
    if (validRequests.length >= limit) {
      return false
    }
    
    validRequests.push(now)
    requests.set(identifier, validRequests)
    return true
  }
}

// Joi validation schemas
export const orderValidationSchema = Joi.object({
  table_id: Joi.string().uuid().required(),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.string().uuid().required(),
      quantity: Joi.number().integer().min(1).max(10).required(),
      price: Joi.number().positive().required(),
      customizations: Joi.object().optional(),
      notes: Joi.string().max(200).optional()
    })
  ).min(1).required(),
  total_amount: Joi.number().positive().required(),
  notes: Joi.string().max(500).optional()
})

export const webhookValidationSchema = Joi.object({
  order_id: Joi.string().required(),
  transaction_status: Joi.string().valid(
    'capture', 'settlement', 'pending', 'deny', 'cancel', 'expire', 'refund'
  ).required(),
  gross_amount: Joi.string().required(),
  status_code: Joi.string().required(),
  signature_key: Joi.string().required(),
  fraud_status: Joi.string().optional(),
  transaction_id: Joi.string().optional(),
  payment_type: Joi.string().optional()
})

// XSS prevention
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

// IP validation for webhook
export function isValidMidtransIP(ip: string): boolean {
  // Midtrans sandbox/production IP ranges
  const midtransIPs = [
    '103.10.128.0/24',
    '103.10.129.0/24', 
    '127.0.0.1', // localhost for development
    '::1' // IPv6 localhost
  ]
  
  // Simple check for development - in production use proper CIDR checking
  return process.env.NODE_ENV === 'development' || 
         midtransIPs.some(range => ip.includes(range.split('/')[0]))
}
