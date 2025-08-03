export interface MenuCategory {
  id: string
  name: string
  description: string
  image?: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category_id: string
  is_available: boolean
  preparation_time: number
  tags: string[]
  customization_options: {
    temperature?: 'hot' | 'ice'
    sugar_level?: 'original' | 'less_sugar' | 'no_sugar'
    spice_level?: 'original' | 'spicy'
  }
  nutritional_info?: {
    calories: number
    caffeine?: number
  }
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'coffee',
    name: 'Coffee',
    description: 'Premium coffee dari biji pilihan terbaik',
    image: '/images/categories/coffee.jpg'
  },
  {
    id: 'non-coffee',
    name: 'Non Coffee',
    description: 'Minuman segar tanpa kafein',
    image: '/images/categories/non-coffee.jpg'
  },
  {
    id: 'food',
    name: 'Food',
    description: 'Makanan ringan dan berat',
    image: '/images/categories/food.jpg'
  },
  {
    id: 'dessert',
    name: 'Dessert',
    description: 'Hidangan penutup yang manis',
    image: '/images/categories/dessert.jpg'
  }
]

export const MENU_ITEMS: MenuItem[] = [
  // Coffee Items
  {
    id: 'americano',
    name: 'Americano',
    description: 'Espresso shot dengan air panas, rasa kopi yang kuat dan murni',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
    category_id: 'coffee',
    is_available: true,
    preparation_time: 5,
    tags: ['popular', 'signature'],
    customization_options: {
      temperature: 'hot',
      sugar_level: 'original'
    },
    nutritional_info: {
      calories: 5,
      caffeine: 154
    }
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Espresso dengan steamed milk dan milk foam yang creamy',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
    category_id: 'coffee',
    is_available: true,
    preparation_time: 7,
    tags: ['popular', 'creamy'],
    customization_options: {
      temperature: 'hot',
      sugar_level: 'original'
    },
    nutritional_info: {
      calories: 120,
      caffeine: 154
    }
  },
  {
    id: 'latte',
    name: 'Caffe Latte',
    description: 'Espresso dengan steamed milk, smooth dan milky',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    category_id: 'coffee',
    is_available: true,
    preparation_time: 6,
    tags: ['bestseller', 'smooth'],
    customization_options: {
      temperature: 'hot',
      sugar_level: 'original'
    },
    nutritional_info: {
      calories: 150,
      caffeine: 77
    }
  },
  {
    id: 'mocha',
    name: 'Mocha',
    description: 'Perpaduan espresso, chocolate, dan steamed milk',
    price: 38000,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category_id: 'coffee',
    is_available: true,
    preparation_time: 8,
    tags: ['sweet', 'chocolate'],
    customization_options: {
      temperature: 'hot',
      sugar_level: 'original'
    },
    nutritional_info: {
      calories: 260,
      caffeine: 95
    }
  },
  {
    id: 'espresso',
    name: 'Espresso',
    description: 'Shot espresso murni, untuk pecinta kopi sejati',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
    category_id: 'coffee',
    is_available: true,
    preparation_time: 3,
    tags: ['strong', 'pure'],
    customization_options: {
      sugar_level: 'original'
    },
    nutritional_info: {
      calories: 5,
      caffeine: 77
    }
  },
  {
    id: 'iced-coffee',
    name: 'Iced Coffee',
    description: 'Kopi dingin yang menyegarkan dengan es batu',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1517701550842-77d7963f170d?w=400&h=300&fit=crop',
    category_id: 'coffee',
    is_available: true,
    preparation_time: 4,
    tags: ['refreshing', 'cold'],
    customization_options: {
      temperature: 'ice',
      sugar_level: 'original'
    },
    nutritional_info: {
      calories: 10,
      caffeine: 95
    }
  },

  // Non-Coffee Items
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    description: 'Matcha premium Jepang dengan steamed milk',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop',
    category_id: 'non-coffee',
    is_available: true,
    preparation_time: 6,
    tags: ['healthy', 'japanese'],
    customization_options: {
      temperature: 'hot',
      sugar_level: 'original'
    },
    nutritional_info: {
      calories: 140,
      caffeine: 35
    }
  },
  {
    id: 'chocolate',
    name: 'Hot Chocolate',
    description: 'Cokelat panas premium dengan whipped cream',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=300&fit=crop',
    category_id: 'non-coffee',
    is_available: true,
    preparation_time: 5,
    tags: ['sweet', 'kids-friendly'],
    customization_options: {
      temperature: 'hot',
      sugar_level: 'original'
    },
    nutritional_info: {
      calories: 300
    }
  },
  {
    id: 'lemon-tea',
    name: 'Lemon Tea',
    description: 'Teh segar dengan perasan lemon asli',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    category_id: 'non-coffee',
    is_available: true,
    preparation_time: 4,
    tags: ['refreshing', 'citrus'],
    customization_options: {
      temperature: 'ice',
      sugar_level: 'original'
    },
    nutritional_info: {
      calories: 80,
      caffeine: 25
    }
  },
  {
    id: 'thai-tea',
    name: 'Thai Tea',
    description: 'Teh Thailand dengan condensed milk yang manis',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    category_id: 'non-coffee',
    is_available: true,
    preparation_time: 5,
    tags: ['sweet', 'traditional'],
    customization_options: {
      temperature: 'ice',
      sugar_level: 'original'
    },
    nutritional_info: {
      calories: 180,
      caffeine: 30
    }
  },

  // Food Items
  {
    id: 'croissant',
    name: 'Butter Croissant',
    description: 'Croissant renyah dengan butter premium',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=400&h=300&fit=crop',
    category_id: 'food',
    is_available: true,
    preparation_time: 3,
    tags: ['pastry', 'buttery'],
    customization_options: {},
    nutritional_info: {
      calories: 250
    }
  },
  {
    id: 'sandwich',
    name: 'Club Sandwich',
    description: 'Sandwich dengan ayam, bacon, lettuce, dan tomato',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop',
    category_id: 'food',
    is_available: true,
    preparation_time: 10,
    tags: ['filling', 'protein'],
    customization_options: {
      spice_level: 'original'
    },
    nutritional_info: {
      calories: 420
    }
  },
  {
    id: 'pasta',
    name: 'Aglio Olio Pasta',
    description: 'Pasta dengan garlic, olive oil, dan parmesan',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    category_id: 'food',
    is_available: true,
    preparation_time: 15,
    tags: ['italian', 'garlic'],
    customization_options: {
      spice_level: 'original'
    },
    nutritional_info: {
      calories: 380
    }
  },
  {
    id: 'pizza',
    name: 'Margherita Pizza',
    description: 'Pizza klasik dengan mozzarella, basil, dan tomato',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    category_id: 'food',
    is_available: true,
    preparation_time: 20,
    tags: ['italian', 'cheese'],
    customization_options: {
      spice_level: 'original'
    },
    nutritional_info: {
      calories: 520
    }
  },

  // Dessert Items
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Dessert Italia klasik dengan mascarpone dan coffee',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    category_id: 'dessert',
    is_available: true,
    preparation_time: 2,
    tags: ['italian', 'coffee-flavored'],
    customization_options: {},
    nutritional_info: {
      calories: 290,
      caffeine: 15
    }
  },
  {
    id: 'cheesecake',
    name: 'New York Cheesecake',
    description: 'Cheesecake creamy dengan berry compote',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop',
    category_id: 'dessert',
    is_available: true,
    preparation_time: 3,
    tags: ['creamy', 'berry'],
    customization_options: {},
    nutritional_info: {
      calories: 350
    }
  },
  {
    id: 'brownie',
    name: 'Chocolate Brownie',
    description: 'Brownie cokelat yang rich dengan vanilla ice cream',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
    category_id: 'dessert',
    is_available: true,
    preparation_time: 5,
    tags: ['chocolate', 'warm'],
    customization_options: {},
    nutritional_info: {
      calories: 380
    }
  }
]

// Helper functions
export const getMenuByCategory = (categoryId: string) => {
  return MENU_ITEMS.filter(item => item.category_id === categoryId)
}

export const getPopularItems = () => {
  return MENU_ITEMS.filter(item => item.tags.includes('popular') || item.tags.includes('bestseller'))
}

export const getAvailableItems = () => {
  return MENU_ITEMS.filter(item => item.is_available)
}

export const searchMenuItems = (query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return MENU_ITEMS.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}
