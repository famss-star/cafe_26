-- Insert sample products based on our dummy data
-- First, get category IDs (assuming they were inserted in the schema)

-- Coffee products
INSERT INTO products (name, description, price, category_id, image_url, customization_options) VALUES
    ('Espresso', 'Kopi hitam pekat dengan rasa yang kuat', 18000, 
     (SELECT id FROM categories WHERE name = 'Kopi' LIMIT 1),
     '/images/espresso.jpg',
     '{"temperature": ["hot", "ice"], "sugar_level": ["original", "less_sugar", "no_sugar"], "size": ["small", "medium", "large"]}'::jsonb),
    
    ('Cappuccino', 'Espresso dengan susu steamed dan foam yang creamy', 25000,
     (SELECT id FROM categories WHERE name = 'Kopi' LIMIT 1),
     '/images/cappuccino.jpg',
     '{"temperature": ["hot", "ice"], "sugar_level": ["original", "less_sugar", "no_sugar"], "size": ["small", "medium", "large"]}'::jsonb),
    
    ('Latte', 'Espresso dengan susu steamed, perfect balance', 27000,
     (SELECT id FROM categories WHERE name = 'Kopi' LIMIT 1),
     '/images/latte.jpg',
     '{"temperature": ["hot", "ice"], "sugar_level": ["original", "less_sugar", "no_sugar"], "size": ["small", "medium", "large"]}'::jsonb),
    
    ('Americano', 'Espresso dengan air panas, rasa yang clean', 22000,
     (SELECT id FROM categories WHERE name = 'Kopi' LIMIT 1),
     '/images/americano.jpg',
     '{"temperature": ["hot", "ice"], "sugar_level": ["original", "less_sugar", "no_sugar"], "size": ["small", "medium", "large"]}'::jsonb),
    
    ('Mocha', 'Kombinasi espresso, cokelat, dan susu yang sempurna', 30000,
     (SELECT id FROM categories WHERE name = 'Kopi' LIMIT 1),
     '/images/mocha.jpg',
     '{"temperature": ["hot", "ice"], "sugar_level": ["original", "less_sugar", "no_sugar"], "size": ["small", "medium", "large"]}'::jsonb);

-- Snacks
INSERT INTO products (name, description, price, category_id, image_url, customization_options) VALUES
    ('Croissant', 'Pastry Prancis yang buttery dan flaky', 15000,
     (SELECT id FROM categories WHERE name = 'Makanan Ringan' LIMIT 1),
     '/images/croissant.jpg',
     '{"temperature": ["original"], "notes": true}'::jsonb),
    
    ('Sandwich Club', 'Sandwich dengan isian daging, keju, dan sayuran segar', 28000,
     (SELECT id FROM categories WHERE name = 'Makanan Ringan' LIMIT 1),
     '/images/sandwich.jpg',
     '{"spice_level": ["original", "spicy"], "notes": true}'::jsonb),
    
    ('Muffin Blueberry', 'Muffin lembut dengan blueberry segar', 18000,
     (SELECT id FROM categories WHERE name = 'Makanan Ringan' LIMIT 1),
     '/images/muffin.jpg',
     '{"temperature": ["original"], "notes": true}'::jsonb),
    
    ('Bagel Cream Cheese', 'Bagel panggang dengan cream cheese', 22000,
     (SELECT id FROM categories WHERE name = 'Makanan Ringan' LIMIT 1),
     '/images/bagel.jpg',
     '{"temperature": ["original"], "notes": true}'::jsonb);

-- Main meals
INSERT INTO products (name, description, price, category_id, image_url, customization_options) VALUES
    ('Nasi Goreng Special', 'Nasi goreng dengan telur, ayam, dan sayuran', 32000,
     (SELECT id FROM categories WHERE name = 'Makanan Berat' LIMIT 1),
     '/images/nasi-goreng.jpg',
     '{"spice_level": ["original", "spicy"], "notes": true}'::jsonb),
    
    ('Pasta Carbonara', 'Pasta dengan saus carbonara yang creamy', 35000,
     (SELECT id FROM categories WHERE name = 'Makanan Berat' LIMIT 1),
     '/images/carbonara.jpg',
     '{"spice_level": ["original", "spicy"], "notes": true}'::jsonb),
    
    ('Chicken Teriyaki', 'Ayam teriyaki dengan nasi dan sayuran', 38000,
     (SELECT id FROM categories WHERE name = 'Makanan Berat' LIMIT 1),
     '/images/teriyaki.jpg',
     '{"spice_level": ["original", "spicy"], "notes": true}'::jsonb),
    
    ('Fish & Chips', 'Ikan goreng crispy dengan kentang goreng', 40000,
     (SELECT id FROM categories WHERE name = 'Makanan Berat' LIMIT 1),
     '/images/fish-chips.jpg',
     '{"spice_level": ["original", "spicy"], "notes": true}'::jsonb);

-- Cold drinks
INSERT INTO products (name, description, price, category_id, image_url, customization_options) VALUES
    ('Iced Tea', 'Teh dingin yang menyegarkan', 12000,
     (SELECT id FROM categories WHERE name = 'Minuman Dingin' LIMIT 1),
     '/images/iced-tea.jpg',
     '{"sugar_level": ["original", "less_sugar", "no_sugar"], "notes": true}'::jsonb),
    
    ('Fresh Orange Juice', 'Jus jeruk segar tanpa pengawet', 18000,
     (SELECT id FROM categories WHERE name = 'Minuman Dingin' LIMIT 1),
     '/images/orange-juice.jpg',
     '{"sugar_level": ["original", "less_sugar", "no_sugar"], "notes": true}'::jsonb),
    
    ('Smoothie Bowl', 'Smoothie dengan topping buah dan granola', 25000,
     (SELECT id FROM categories WHERE name = 'Minuman Dingin' LIMIT 1),
     '/images/smoothie.jpg',
     '{"sugar_level": ["original", "less_sugar", "no_sugar"], "notes": true}'::jsonb);

-- Desserts
INSERT INTO products (name, description, price, category_id, image_url, customization_options) VALUES
    ('Cheesecake', 'Cheesecake lembut dengan berry sauce', 28000,
     (SELECT id FROM categories WHERE name = 'Dessert' LIMIT 1),
     '/images/cheesecake.jpg',
     '{"temperature": ["original"], "notes": true}'::jsonb),
    
    ('Chocolate Brownie', 'Brownie cokelat yang fudgy dengan ice cream', 22000,
     (SELECT id FROM categories WHERE name = 'Dessert' LIMIT 1),
     '/images/brownie.jpg',
     '{"temperature": ["original"], "notes": true}'::jsonb),
    
    ('Tiramisu', 'Dessert Italia dengan mascarpone dan coffee', 30000,
     (SELECT id FROM categories WHERE name = 'Dessert' LIMIT 1),
     '/images/tiramisu.jpg',
     '{"temperature": ["original"], "notes": true}'::jsonb);

-- Insert sample voucher
INSERT INTO vouchers (code, name, description, discount_type, discount_value, min_order_amount, valid_from, valid_until) VALUES
    ('WELCOME10', 'Welcome Discount', 'Diskon 10% untuk pelanggan baru', 'percentage', 10, 50000, NOW(), NOW() + INTERVAL '30 days'),
    ('COFFEE20', 'Coffee Lover', 'Diskon 20% untuk semua menu kopi', 'percentage', 20, 25000, NOW(), NOW() + INTERVAL '7 days'),
    ('SAVE15K', 'Save 15K', 'Potongan Rp 15.000 untuk pembelian minimal Rp 100.000', 'fixed', 15000, 100000, NOW(), NOW() + INTERVAL '14 days');
