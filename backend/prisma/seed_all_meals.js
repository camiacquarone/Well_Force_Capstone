
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seedMeals = async () => {
  const meals = [
    {
      name: 'Chicken Burrito Bowl',
      price: 12.00,
      restaurant_name: 'Chipotle',
      image_url: 'https://example.com/chicken-burrito.jpg',
      nutritional_information: {
        create: {
          serving_size: 450,
          calories: 910,
          total_fat: 7,
          cholesterol: 125,
          sodium: 310,
          total_carbs: 50,
          protein: 32,
          sugars: 4,
        },
      },
      dietary_preferences: {
        create: {
          isGlutenFree: true,
          isVegan: false,
          isVegetarian: false,
          isKeto: false,
          Allergies: [],
        },
      },
    },
    {
      name: 'Veggie Salad Bowl',
      price: 10.00,
      restaurant_name: 'Chipotle',
      image_url: 'https://example.com/veggie-salad.jpg',
      nutritional_information: {
        create: {
          serving_size: 400,
          calories: 420,
          total_fat: 12,
          cholesterol: 30,
          sodium: 300,
          total_carbs: 45,
          protein: 14,
          sugars: 6,
        },
      },
      dietary_preferences: {
        create: {
          isGlutenFree: true,
          isVegan: true,
          isVegetarian: true,
          isKeto: false,
          Allergies: [],
        },
      },
    },
    {
      name: 'Barbacoa Tacos (3pcs)',
      price: 13.50,
      restaurant_name: 'Chipotle',
      image_url: 'https://example.com/barbacoa-tacos.jpg',
      nutritional_information: {
        create: {
          serving_size: 350,
          calories: 1100,
          total_fat: 21,
          cholesterol: 160,
          sodium: 1200,
          total_carbs: 90,
          protein: 45,
          sugars: 8,
        },
      },
      dietary_preferences: {
        create: {
          isGlutenFree: false,
          isVegan: false,
          isVegetarian: false,
          isKeto: false,
          Allergies: [],
        },
      },
    },
  ];

  for (const meal of meals) {
    await prisma.meals.create({ data: meal });
  }

  console.log('🌮 Seeded meals successfully');
};

seedMeals()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
