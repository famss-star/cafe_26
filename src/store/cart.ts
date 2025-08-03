import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product, ProductCustomization } from '@/types'

interface CartState {
  items: CartItem[]
  tableNumber: string | null
  
  // Actions
  addItem: (product: Product, customization?: ProductCustomization, quantity?: number) => void
  removeItem: (itemId: string) => void
  updateItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  setTableNumber: (tableNumber: string) => void
  
  // Getters
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemById: (itemId: string) => CartItem | undefined
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableNumber: null,

      addItem: (product, customization, quantity = 1) => {
        set((state) => {
          // Check if item with same product and customization already exists
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product_id === product.id &&
              JSON.stringify(item.customization) === JSON.stringify(customization)
          )

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantity += quantity
            return { items: updatedItems }
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `${product.id}-${Date.now()}`,
              product_id: product.id,
              product,
              quantity,
              customization,
              price: product.price,
            }
            return { items: [...state.items, newItem] }
          }
        })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateItemQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [], tableNumber: null })
      },

      setTableNumber: (tableNumber) => {
        set({ tableNumber })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getItemById: (itemId) => {
        return get().items.find((item) => item.id === itemId)
      },
    }),
    {
      name: 'kawa-leaves-cart',
      partialize: (state) => ({
        items: state.items,
        tableNumber: state.tableNumber,
      }),
    }
  )
)

// Convenience hook for easier usage
export const useCart = () => {
  const store = useCartStore()
  return {
    items: store.items,
    tableNumber: store.tableNumber,
    addItem: (item: CartItem) => {
      store.addItem(item.product, item.customization, item.quantity)
    },
    removeItem: store.removeItem,
    updateItemQuantity: store.updateItemQuantity,
    clearCart: store.clearCart,
    setTableNumber: store.setTableNumber,
    getTotalItems: store.getTotalItems,
    getTotalPrice: store.getTotalPrice,
    getItemById: store.getItemById,
  }
}
