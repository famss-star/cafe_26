export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export type UserRole = 'customer' | 'admin' | 'owner' | 'super_user'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: ProductCategory
  image_url?: string
  is_available: boolean
  customization_options?: ProductCustomization
  created_at: string
  updated_at: string
}

export type ProductCategory = 'coffee' | 'tea' | 'food' | 'snacks' | 'dessert'

export interface ProductCustomization {
  temperature?: 'hot' | 'ice'
  sugar_level?: 'original' | 'less_sugar' | 'no_sugar'
  spice_level?: 'original' | 'spicy'
  notes?: string
}

export interface CartItem {
  id: string
  product_id: string
  product: Product
  quantity: number
  customization?: ProductCustomization
  price: number
}

export interface Order {
  id: string
  customer_id?: string
  table_number: string
  order_items?: OrderItem[]
  subtotal: number
  total_amount: number
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method?: string
  midtrans_transaction_id?: string
  voucher_code?: string
  discount_amount?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  product_id: string
  products?: Product // For Supabase joins
  quantity: number
  customizations?: Record<string, unknown>
  notes?: string
  price: number
  subtotal: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded'

export interface Table {
  id: string
  table_number: string
  qr_code: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Voucher {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  min_order_amount?: number
  max_discount_amount?: number
  usage_limit?: number
  used_count: number
  valid_from: string
  valid_until: string
  is_active: boolean
  allowed_users?: string[]
  allowed_roles?: UserRole[]
  created_at: string
  updated_at: string
}

export interface MidtransSnapResponse {
  token: string
  redirect_url: string
}

export interface MidtransNotification {
  transaction_time: string
  transaction_status: string
  transaction_id: string
  status_message: string
  status_code: string
  signature_key: string
  payment_type: string
  order_id: string
  merchant_id: string
  gross_amount: string
  fraud_status: string
  currency: string
}
