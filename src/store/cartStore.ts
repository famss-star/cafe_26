import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  product_id: string
  product_name: string
  product_price: number
  product_image: string
  quantity: number
  customizations: {
    temperature?: 'hot' | 'ice'
    sugar_level?: 'original' | 'less_sugar' | 'no_sugar'
    spice_level?: 'original' | 'spicy'
    size?: 'small' | 'medium' | 'large'
  }
  notes?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  tableNumber: number | null
  
  // Actions
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateCustomizations: (id: string, customizations: CartItem['customizations']) => void
  updateNotes: (id: string, notes: string) => void
  setTableNumber: (tableNumber: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  
  // Computed values
  getTotalItems: () => number
  getTotalPrice: () => number
  getCartSummary: () => {
    totalItems: number
    totalPrice: number
    itemCount: number
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      tableNumber: null,

      addItem: (newItem: CartItem) => {
        set((state) => {
          // Check if item with same product_id and customizations already exists
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product_id === newItem.product_id &&
              JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations)
          )

          if (existingItemIndex >= 0) {
            // Update quantity of existing item
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += newItem.quantity
            return { items: updatedItems }
          } else {
            // Add new item
            return { items: [...state.items, newItem] }
          }
        })
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id)
        }))
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        }))
      },

      updateCustomizations: (id: string, customizations: CartItem['customizations']) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, customizations } : item
          )
        }))
      },

      updateNotes: (id: string, notes: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, notes } : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [], tableNumber: null })
      },

      setTableNumber: (tableNumber: number) => {
        set({ tableNumber })
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.product_price * item.quantity), 0)
      },

      getCartSummary: () => {
        const state = get()
        return {
          totalItems: state.getTotalItems(),
          totalPrice: state.getTotalPrice(),
          itemCount: state.items.length
        }
      }
    }),
    {
      name: 'kawa-leaves-cart', // unique name for localStorage
      partialize: (state) => ({ items: state.items }), // only persist items, not UI state
    }
  )
)
