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
      { name: 'Vegan', isVegan: true, isVegetarian: true, isGlutenFree: false, isLactoseInt: false, isKeto: false, Allergies: [] },
      { name: 'Vegetarian', isVegan: false, isVegetarian: true, isGlutenFree: false, isLactoseInt: false, isKeto: false, Allergies: [] },
      { name: 'Gluten-Free', isVegan: false, isVegetarian: false, isGlutenFree: true, isLactoseInt: false, isKeto: false, Allergies: [] },
      { name: 'Keto', isVegan: false, isVegetarian: false, isGlutenFree: false, isLactoseInt: false, isKeto: true, Allergies: [] },
      { name: 'Protein', isVegan: false, isVegetarian: false, isGlutenFree: false, isLactoseInt: false, isKeto: false, Allergies: [] }, // Example: if "Protein" is a dietary pref
      { name: 'Vegetables', isVegan: false, isVegetarian: true, isGlutenFree: false, isLactoseInt: false, isKeto: false, Allergies: [] }, // Example: if "Vegetables" is a dietary pref
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