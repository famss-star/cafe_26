export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'customer' | 'admin' | 'owner' | 'super_user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'owner' | 'super_user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'customer' | 'admin' | 'owner' | 'super_user'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category_id: string
          image_url: string | null
          is_available: boolean
          customization_options: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category_id: string
          image_url?: string | null
          is_available?: boolean
          customization_options?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category_id?: string
          image_url?: string | null
          is_available?: boolean
          customization_options?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      tables: {
        Row: {
          id: string
          table_number: number
          qr_code: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          table_number: number
          qr_code: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          table_number?: number
          qr_code?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          table_id: string
          order_number: string
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total_amount: number
          payment_status: 'pending' | 'paid' | 'failed' | 'cancelled'
          payment_method: string | null
          midtrans_order_id: string | null
          midtrans_transaction_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          table_id: string
          order_number: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total_amount: number
          payment_status?: 'pending' | 'paid' | 'failed' | 'cancelled'
          payment_method?: string | null
          midtrans_order_id?: string | null
          midtrans_transaction_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          table_id?: string
          order_number?: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total_amount?: number
          payment_status?: 'pending' | 'paid' | 'failed' | 'cancelled'
          payment_method?: string | null
          midtrans_order_id?: string | null
          midtrans_transaction_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          customizations: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          customizations?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          customizations?: Json | null
          created_at?: string
        }
      }
      vouchers: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order_amount: number | null
          max_discount: number | null
          usage_limit: number | null
          used_count: number
          valid_from: string
          valid_until: string
          is_active: boolean
          user_restrictions: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description?: string | null
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order_amount?: number | null
          max_discount?: number | null
          usage_limit?: number | null
          used_count?: number
          valid_from: string
          valid_until: string
          is_active?: boolean
          user_restrictions?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string | null
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          min_order_amount?: number | null
          max_discount?: number | null
          usage_limit?: number | null
          used_count?: number
          valid_from?: string
          valid_until?: string
          is_active?: boolean
          user_restrictions?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'admin' | 'owner' | 'super_user'
      order_status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
      payment_status: 'pending' | 'paid' | 'failed' | 'cancelled'
      discount_type: 'percentage' | 'fixed'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
