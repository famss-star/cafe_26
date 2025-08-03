import { useState, useEffect } from 'react'
import { MENU_CATEGORIES, MENU_ITEMS, getMenuByCategory, searchMenuItems, getPopularItems } from '@/lib/data/menu'
import type { MenuCategory, MenuItem } from '@/lib/data/menu'

// Simulate API delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export function useMenuCategories(): ApiResponse<MenuCategory[]> {
  const [state, setState] = useState<ApiResponse<MenuCategory[]>>({
    data: null,
    error: null,
    loading: true
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await delay(300) // Simulate API call
        setState({
          data: MENU_CATEGORIES,
          error: null,
          loading: false
        })
      } catch {
        setState({
          data: null,
          error: 'Failed to fetch categories',
          loading: false
        })
      }
    }

    fetchCategories()
  }, [])

  return state
}

export function useMenuItems(categoryId?: string): ApiResponse<MenuItem[]> {
  const [state, setState] = useState<ApiResponse<MenuItem[]>>({
    data: null,
    error: null,
    loading: true
  })

  useEffect(() => {
    const fetchItems = async () => {
      setState(prev => ({ ...prev, loading: true }))
      try {
        await delay(500) // Simulate API call
        const items = categoryId ? getMenuByCategory(categoryId) : MENU_ITEMS
        setState({
          data: items,
          error: null,
          loading: false
        })
      } catch {
        setState({
          data: null,
          error: 'Failed to fetch menu items',
          loading: false
        })
      }
    }

    fetchItems()
  }, [categoryId])

  return state
}

export function useSearchMenu(query: string): ApiResponse<MenuItem[]> {
  const [state, setState] = useState<ApiResponse<MenuItem[]>>({
    data: null,
    error: null,
    loading: false
  })

  useEffect(() => {
    if (!query.trim()) {
      setState({
        data: [],
        error: null,
        loading: false
      })
      return
    }

    const searchItems = async () => {
      setState(prev => ({ ...prev, loading: true }))
      try {
        await delay(200) // Simulate search delay
        const results = searchMenuItems(query)
        setState({
          data: results,
          error: null,
          loading: false
        })
      } catch {
        setState({
          data: null,
          error: 'Search failed',
          loading: false
        })
      }
    }

    const timeoutId = setTimeout(searchItems, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [query])

  return state
}

export function usePopularItems(): ApiResponse<MenuItem[]> {
  const [state, setState] = useState<ApiResponse<MenuItem[]>>({
    data: null,
    error: null,
    loading: true
  })

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        await delay(300)
        const popular = getPopularItems()
        setState({
          data: popular,
          error: null,
          loading: false
        })
      } catch {
        setState({
          data: null,
          error: 'Failed to fetch popular items',
          loading: false
        })
      }
    }

    fetchPopular()
  }, [])

  return state
}
