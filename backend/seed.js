const { PrismaClient } = require('./generated/prisma');
const prisma = new PrismaClient()
const fs = require('fs')
const path = require ('path')

async function seed() {
  try {
    console.log('🌱 Starting database seeding for Goals and Dietary Preferences...\n');

    // --- 1. Clear existing data for these models (optional, but good for clean re-seeding) ---
    // If you uncomment these, be careful as they will delete all records in these tables!
    // They are usually safer for development/testing environments.
    await prisma.goals.deleteMany();
    console.log('🗑️ Cleared existing Goals data.');
    await prisma.dietary_Preferences.deleteMany();
    console.log('🗑️ Cleared existing Dietary_Preferences data.');

    // --- 2. Seed Goals (e.g., "Protein", "Vegetables", "Days of the Week") ---
    // Make sure these 'title' values EXACTLY match what your frontend sends.
    //
    const goalsData = [
      { title: 'Protein', description: 'Focus on consuming more protein', category: 'Nutrition Goal' },
      { title: 'Vegetables', description: 'Increase daily vegetable intake', category: 'Nutrition Goal' },
      { title: 'Weight Loss', description: 'Goal to reduce body weight', category: 'Health Goal' },
      { title: 'Muscle Gain', description: 'Goal to build muscle mass', category: 'Health Goal' },
    ];
    console.log(`✨ Seeding ${goalsData.length} Goals...`);
    for (const data of goalsData) {
      await prisma.goals.upsert({
        where: { title: data.title }, // Identify by unique title
        update: {}, // No update if it exists
        create: data, // Create with all data if it doesn't exist
      });
    }
    console.log('✅ Goals seeded successfully.');

    // --- 3. Seed Dietary_Preferences ---
    // Make sure these 'name' values EXACTLY match what your frontend sends.
    // Ensure all boolean/array fields (isGlutenFree, Allergies, etc.) are included with defaults.
    const dietaryPreferencesData = [
      { name: 'Vegan', isVegan: true, isVegetarian: true, isGlutenFree: false, isLactoseInt: false, isKeto: false },
      { name: 'Vegetarian', isVegan: false, isVegetarian: true, isGlutenFree: false, isLactoseInt: false, isKeto: false  },
      { name: 'Gluten-Free', isVegan: false, isVegetarian: false, isGlutenFree: true, isLactoseInt: false, isKeto: false  },
      { name: 'Keto', isVegan: false, isVegetarian: false, isGlutenFree: false, isLactoseInt: false, isKeto: true  },
      { name: 'Protein', isVegan: false, isVegetarian: false, isGlutenFree: false, isLactoseInt: false, isKeto: false  }, // Example: if "Protein" is a dietary pref
      { name: 'Vegetables', isVegan: false, isVegetarian: true, isGlutenFree: false, isLactoseInt: false, isKeto: false  }, // Example: if "Vegetables" is a dietary pref
    ];
    console.log(`✨ Seeding ${dietaryPreferencesData.length} Dietary Preferences...`);
    for (const data of dietaryPreferencesData) {
      await prisma.dietary_Preferences.upsert({
        where: { name: data.name }, // Identify by unique name
        update: {},
        create: data,
      });
    }
    console.log('✅ Dietary Preferences seeded successfully.');
    const mealData = [
    // Sweetgreen
    {
      name: "Harvest Bowl",
      restaurant_name: "Sweetgreen",
      price: 12.95,
      image_url: "https://images.sweetgreen.com/menu/harvest-bowl.jpg",
      nutritional_information: {
        serving_size: 1,
        calories: 685,
        protein: 36,
        total_fat: 32,
        cholesterol: 90,
        sodium: 735,
        total_carbs: 65,
        sugars: 9,
      },
      dietary_pref_names: ["Gluten-Free", "Protein"]
    },
    {
      name: "Shroomami Bowl",
      restaurant_name: "Sweetgreen",
      price: 11.95,
      image_url: "https://images.sweetgreen.com/menu/shroomami.jpg",
      nutritional_information: {
        serving_size: 1,
        calories: 600,
        protein: 24,
        total_fat: 28,
        cholesterol: 0,
        sodium: 720,
        total_carbs: 70,
        sugars: 6,
      },
      dietary_pref_names: ["Vegan", "Vegetables"]
    },

    // Mendocino Farms
    {
      name: "Impossible Taco Salad",
      restaurant_name: "Mendocino Farms",
      price: 13.5,
      image_url: "https://mendocinofarms.com/images/impossible-taco-salad.jpg",
      nutritional_information: {
        serving_size: 1,
        calories: 730,
        protein: 28,
        total_fat: 38,
        cholesterol: 0,
        sodium: 940,
        total_carbs: 65,
        sugars: 7,
      },
      dietary_pref_names: ["Vegetarian", "Gluten-Free"]
    },
    {
      name: "Peruvian Steak Sandwich",
      restaurant_name: "Mendocino Farms",
      price: 14.25,
      image_url: "https://mendocinofarms.com/images/peruvian-steak.jpg",
      nutritional_information: {
        serving_size: 1,
        calories: 790,
        protein: 40,
        total_fat: 36,
        cholesterol: 95,
        sodium: 1150,
        total_carbs: 60,
        sugars: 4,
      },
      dietary_pref_names: ["Protein"]
    },

    // Wingstop
    {
      name: "Classic Wings (10 pcs)",
      restaurant_name: "Wingstop",
      price: 13.99,
      image_url: "https://wingstop.com/menu/classic-wings.jpg",
      nutritional_information: {
        serving_size: 1,
        calories: 900,
        protein: 60,
        total_fat: 70,
        cholesterol: 140,
        sodium: 1500,
        total_carbs: 3,
        sugars: 0,
      },
      dietary_pref_names: ["Keto", "Protein"]
    },
    {
      name: "Boneless Wings (10 pcs)",
      restaurant_name: "Wingstop",
      price: 12.99,
      image_url: "https://wingstop.com/menu/boneless-wings.jpg",
      nutritional_information: {
        serving_size: 1,
        calories: 870,
        protein: 45,
        total_fat: 50,
        cholesterol: 125,
        sodium: 1350,
        total_carbs: 50,
        sugars: 1,
      },
      dietary_pref_names: ["Protein"]
    },

    // Starbird
    {
      name: "Super Slaw Salad",
      restaurant_name: "Starbird",
      price: 11.75,
      image_url: "https://starbirdchicken.com/menu/super-slaw-salad.jpg",
      nutritional_information: {
        serving_size: 1,
        calories: 520,
        protein: 20,
        total_fat: 28,
        cholesterol: 40,
        sodium: 640,
        total_carbs: 48,
        sugars: 8,
      },
      dietary_pref_names: ["Vegetarian", "Gluten-Free"]
    },
    {
      name: "Crispy Chicken Sandwich",
      restaurant_name: "Starbird",
      price: 12.5,
      image_url: "https://starbirdchicken.com/menu/chicken-sandwich.jpg",
      nutritional_information: {
        serving_size: 1,
        calories: 780,
        protein: 38,
        total_fat: 40,
        cholesterol: 80,
        sodium: 980,
        total_carbs: 62,
        sugars: 5,
      },
      dietary_pref_names: ["Protein"]
    },
  ];

  console.log(`✨ Seeding ${mealData.length} Meals...`);

  for (const meal of mealData) {
    const createdMeal = await prisma.meals.create({
      data: {
        name: meal.name,
        restaurant_name: meal.restaurant_name,
        price: meal.price,
        image_url: meal.image_url,
        nutritional_information: {
          create: meal.nutritional_information
        },
        dietary_preferences: {
          connect: meal.dietary_pref_names.map(name => ({ name }))
        }
      },
      include: {
        nutritional_information: true,
        dietary_preferences: true
      }
    });

    console.log(`✅ Added meal: ${createdMeal.name} from ${createdMeal.restaurant_name}`);
  }
  
  const snackData = [
    {
      name: "Banana",
      description: "Fresh banana – a naturally sweet and portable fruit.",
      image_url: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
      wellness_category: ["Fruit", "Energy Boost"],
      nutritional_info: {
        serving_size: 1,
        calories: 105,
        protein: 1,
        total_fat: 0,
        cholesterol: 0,
        sodium: 1,
        total_carbs: 27,
        sugars: 14,
      },
      dietary_pref_names: ["Vegan", "Vegetarian", "Gluten-Free"]
    },
    {
      name: "100 Calorie SkinnyPop",
      description: "Pre-portioned popcorn bag made with simple ingredients.",
      image_url: "https://images.ctfassets.net/9tka4b3550oc/100calorieskinny/8aa2d72a42edabe2edfbff7f1cf68101/100calorieskinny.png",
      wellness_category: ["Low-Calorie", "Gluten-Free"],
      nutritional_info: {
        serving_size: 1,
        calories: 100,
        protein: 2,
        total_fat: 6,
        cholesterol: 0,
        sodium: 50,
        total_carbs: 9,
        sugars: 0,
      },
      dietary_pref_names: ["Vegan", "Vegetarian", "Gluten-Free"]
    },
  ];

  console.log(`✨ Seeding ${snackData.length} Snacks...`);

  for (const snack of snackData) {
    const createdSnack = await prisma.snacks.create({
      data: {
        name: snack.name,
        description: snack.description,
        image_url: snack.image_url,
        wellness_category: snack.wellness_category,
        nutritional_info: {
          create: snack.nutritional_info
        },
        dietary_preferences: {
          connect: snack.dietary_pref_names.map(name => ({ name }))
        }
      },
      include: {
        nutritional_info: true,
        dietary_preferences: true
      }
    });

    console.log(`✅ Added snack: ${createdSnack.name}`);
  }
    console.log('\n🎉 All specified seeding complete!');

  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1); // Exit with error code if seeding fails
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client disconnects
    console.log('🔌 Prisma client disconnected.');
  }
}

// Execute the seed function
seed();