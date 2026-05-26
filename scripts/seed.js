const fs = require('fs');
const path = require('path');

// --- Helper Functions ---
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

// --- Food Generator (1000+ items) ---
const cuisines = ['Indian', 'Italian', 'Chinese', 'Mexican', 'American', 'Thai', 'Japanese', 'Mediterranean'];
const mealTypes = ['veg', 'non-veg', 'vegan'];
const packaging = ['plastic', 'paper', 'reusable'];

const foodPrefixes = ['Spicy', 'Crispy', 'Creamy', 'Grilled', 'Roasted', 'Steamed', 'Fried', 'Baked', 'Classic', 'Signature', 'Premium', 'Double', 'Supreme'];
const foodBases = {
  'Indian': ['Paneer Tikka', 'Butter Chicken', 'Dal Makhani', 'Biryani', 'Naan', 'Masala Dosa', 'Chole Bhature', 'Samosa Chaat', 'Palak Paneer', 'Rogan Josh', 'Aloo Gobi', 'Tandoori Chicken', 'Malai Kofta', 'Vada Pav'],
  'Italian': ['Margherita Pizza', 'Pasta Alfredo', 'Spaghetti Bolognese', 'Lasagna', 'Ravioli', 'Risotto', 'Fettuccine', 'Gnocchi', 'Bruschetta', 'Tiramisu', 'Pesto Penne', 'Calzone'],
  'Chinese': ['Hakka Noodles', 'Manchurian', 'Spring Rolls', 'Fried Rice', 'Dim Sum', 'Chop Suey', 'Kung Pao Chicken', 'Sweet and Sour Pork', 'Peking Duck', 'Mapo Tofu', 'Wonton Soup'],
  'Mexican': ['Tacos', 'Burrito', 'Quesadilla', 'Nachos', 'Fajitas', 'Enchiladas', 'Churros', 'Guacamole', 'Salsa', 'Chimichanga'],
  'American': ['Cheeseburger', 'Hot Dog', 'BBQ Ribs', 'Mac and Cheese', 'Buffalo Wings', 'Steak', 'Apple Pie', 'Milkshake', 'Onion Rings', 'Club Sandwich'],
  'Thai': ['Pad Thai', 'Tom Yum Soup', 'Green Curry', 'Red Curry', 'Som Tum', 'Mango Sticky Rice', 'Massaman Curry', 'Spring Rolls'],
  'Japanese': ['Sushi Roll', 'Sashimi', 'Ramen', 'Udon', 'Tempura', 'Teriyaki Chicken', 'Miso Soup', 'Takoyaki', 'Matcha Mochi'],
  'Mediterranean': ['Falafel', 'Hummus', 'Shawarma', 'Gyros', 'Greek Salad', 'Baba Ganoush', 'Baklava', 'Kebab', 'Pita Bread']
};
const foodSuffixes = ['Combo', 'Bowl', 'Platter', 'Special', 'Delight', 'Wrap', 'Meal', 'Feast'];

function generateFoodDB() {
  const foods = [];
  let id = 1;

  for (const cuisine of cuisines) {
    const bases = foodBases[cuisine];
    for (const base of bases) {
      // Generate multiple variations for each base to reach 1000+
      for (let i = 0; i < 15; i++) {
        const prefix = randomItem(foodPrefixes);
        const suffix = randomItem(foodSuffixes);
        const title = `${prefix} ${base} ${suffix}`;
        
        let mealType = 'veg';
        if (title.toLowerCase().includes('chicken') || title.toLowerCase().includes('pork') || title.toLowerCase().includes('duck') || title.toLowerCase().includes('steak') || title.toLowerCase().includes('beef') || title.toLowerCase().includes('sashimi') || title.toLowerCase().includes('shawarma')) {
          mealType = 'non-veg';
        } else if (title.toLowerCase().includes('vegan') || title.toLowerCase().includes('tofu') || title.toLowerCase().includes('salad')) {
          mealType = 'vegan';
        } else {
          mealType = randomItem(mealTypes);
        }

        foods.push({
          id: `food-${id++}`,
          title: title,
          cuisine: cuisine,
          mealType: mealType,
          packagingType: randomItem(packaging),
          price: randomInt(150, 950),
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
          restaurant: `${randomItem(['The', 'Great', 'Authentic', 'Urban', 'Spicy', 'Royal'])} ${cuisine} ${randomItem(['Kitchen', 'Bistro', 'House', 'Diner', 'Express'])}`,
          image: '🍽️'
        });
      }
    }
  }
  return foods; // Will be roughly ~1200 items
}

// --- Clothes Generator (100+ items) ---
const clothesCategories = ['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Jackets', 'Sweaters', 'Dresses', 'Activewear', 'Accessories'];
const materials = ['Cotton', 'Polyester', 'Denim', 'Wool', 'Silk', 'Linen', 'Nylon', 'Blend', 'Recycled Polyester', 'Organic Cotton'];
const brands = ['UrbanOutfit', 'EcoWear', 'FastStyle', 'PremiumThread', 'ActiveFit', 'LuxeApparel'];

function generateClothesDB() {
  const clothes = [];
  let id = 1;

  for (let i = 0; i < 150; i++) {
    const category = randomItem(clothesCategories);
    const material = randomItem(materials);
    
    let productType = 'fast-fashion';
    if (material === 'Recycled Polyester' || material === 'Organic Cotton' || material === 'Linen') {
      productType = 'sustainable-brand';
    } else if (Math.random() > 0.8) {
      productType = 'second-hand';
    }

    clothes.push({
      id: `cloth-${id++}`,
      title: `${randomItem(['Classic', 'Modern', 'Vintage', 'Slim-Fit', 'Oversized', 'Casual', 'Formal'])} ${material} ${category.slice(0, -1)}`,
      category: category,
      material: material,
      productType: productType,
      brand: randomItem(brands),
      price: randomInt(499, 4999),
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      image: '👕'
    });
  }
  return clothes;
}

// --- Write to Files ---
const dataDir = path.join(__dirname, '../src/lib/data');

const foods = generateFoodDB();
fs.writeFileSync(path.join(dataDir, 'food.json'), JSON.stringify(foods, null, 2));
console.log(`Generated ${foods.length} food items.`);

const clothes = generateClothesDB();
fs.writeFileSync(path.join(dataDir, 'clothes.json'), JSON.stringify(clothes, null, 2));
console.log(`Generated ${clothes.length} clothing items.`);
