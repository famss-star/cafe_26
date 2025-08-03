import { createClient } from '@supabase/supabase-js'
import { MENU_ITEMS, MENU_CATEGORIES } from '../lib/data/menu'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateDummyDataToSupabase() {
  try {
    console.log('🚀 Starting data migration to Supabase...')
    console.log(`📊 Migrating ${MENU_CATEGORIES.length} categories and ${MENU_ITEMS.length} products`)

    // 1. Insert Categories (handle duplicates)
    console.log('📂 Inserting categories...')
    const categoryIdMap = new Map()
    
    for (const cat of MENU_CATEGORIES) {
      // First try to find existing category
      const { data: existing } = await supabase
        .from('categories')
        .select('id, name')
        .eq('name', cat.name)
        .single()

      if (existing) {
        categoryIdMap.set(cat.id, existing.id)
        console.log(`✅ Category exists: ${cat.id} -> ${existing.id}`)
        continue
      }

      // Insert new category if not exists
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: cat.name,
          description: cat.description
        })
        .select()
        .single()

      if (error) {
        console.error(`❌ Error inserting category ${cat.name}:`, error)
        throw error
      }

      // Map old string ID to new UUID
      categoryIdMap.set(cat.id, data.id)
      console.log(`✅ Category inserted: ${cat.id} -> ${data.id}`)
    }

    console.log(`✅ Categories processed: ${categoryIdMap.size}`)

    // 2. Insert Products (map category IDs)
    console.log('🍕 Inserting products...')
    let productsInserted = 0
    
    for (const item of MENU_ITEMS) {
      const newCategoryId = categoryIdMap.get(item.category_id)
      if (!newCategoryId) {
        console.error(`❌ Category not found for product ${item.name}: ${item.category_id}`)
        continue
      }

      const { error } = await supabase
        .from('products')
        .insert({
          name: item.name,
          description: item.description,
          price: item.price,
          // image: item.image, // Remove if column doesn't exist
          category_id: newCategoryId,
          is_available: item.is_available,
          // preparation_time: item.preparation_time, // Remove if column doesn't exist
          // tags: item.tags, // Remove if column doesn't exist
          // customization_options: item.customization_options, // Remove if column doesn't exist
          // nutritional_info: item.nutritional_info || {} // Remove if column doesn't exist
        })
        .select()
        .single()

      if (error) {
        console.error(`❌ Error inserting product ${item.name}:`, error)
        continue
      }

      productsInserted++
      console.log(`✅ Product inserted: ${item.name}`)
    }

    console.log(`✅ Products inserted: ${productsInserted}`)

    // 3. Create Tables (1-10 for testing)
    console.log('🪑 Creating tables...')
    const tablesData = Array.from({ length: 10 }, (_, i) => ({
      table_number: i + 1,
      qr_code: `${process.env.NEXT_PUBLIC_BASE_URL}/table/${i + 1}`
    }))

    const { data: tablesInserted, error: tablesError } = await supabase
      .from('tables')
      .upsert(tablesData, { 
        onConflict: 'table_number',
        ignoreDuplicates: false 
      })
      .select()

    if (tablesError) {
      console.error('❌ Error creating tables:', tablesError)
      throw tablesError
    }

    console.log(`✅ Tables created: ${tablesInserted?.length || 0}`)

    // Skip vouchers for now due to schema mismatch
    console.log('🎫 Skipping vouchers (schema mismatch)')

    console.log('\n🎉 Migration completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Categories: ${categoryIdMap.size}`)
    console.log(`   - Products: ${productsInserted}`)
    console.log(`   - Tables: ${tablesInserted?.length || 0}`)
    console.log(`   - Vouchers: 0 (skipped)`)

    return {
      success: true,
      categories: categoryIdMap.size,
      products: productsInserted,
      tables: tablesInserted?.length || 0,
      vouchers: 0
    }

  } catch (error) {
    console.error('💥 Migration failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Test connection first
async function testConnection() {
  try {
    console.log('🔗 Testing Supabase connection...')
    const { error } = await supabase
      .from('categories')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }

    console.log('✅ Supabase connection successful!')
    return true
  } catch (error) {
    console.error('💥 Connection test failed:', error)
    return false
  }
}

// Main execution
async function main() {
  console.log('🧪 Kawa Leaves Coffee - Data Migration Script')
  console.log('=' .repeat(50))
  
  const connectionOk = await testConnection()
  if (!connectionOk) {
    console.log('❌ Cannot proceed with migration due to connection issues')
    process.exit(1)
  }

  console.log('')
  const result = await migrateDummyDataToSupabase()
  
  if (result.success) {
    console.log('\n✨ Next steps:')
    console.log('1. Update components to use Supabase hooks')
    console.log('2. Test the application')
    console.log('3. Remove dummy data files')
    process.exit(0)
  } else {
    console.log(`\n❌ Migration failed: ${result.error}`)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { migrateDummyDataToSupabase, testConnection }
