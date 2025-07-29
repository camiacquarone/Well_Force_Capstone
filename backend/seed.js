const { PrismaClient } = require("./generated/prisma");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

async function seed() {
  try {
    console.log(
      "🌱 Starting database seeding for Goals and Dietary Preferences...\n"
    );

    // --- 1. Clear existing data for these models (optional, but good for clean re-seeding) ---
    // If you uncomment these, be careful as they will delete all records in these tables!
    // They are usually safer for development/testing environments.
    await prisma.goals.deleteMany();
    console.log("🗑️ Cleared existing Goals data.");
    await prisma.dietary_Preferences.deleteMany();
    console.log("🗑️ Cleared existing Dietary_Preferences data.");

    // --- 2. Seed Goals (e.g., "Protein", "Vegetables", "Days of the Week") ---
    // Make sure these 'title' values EXACTLY match what your frontend sends.
    //
    const goalsData = [
      {
        title: "Protein",
        description: "Focus on consuming more protein",
        category: "Nutrition Goal",
      },
      {
        title: "Vegetables",
        description: "Increase daily vegetable intake",
        category: "Nutrition Goal",
      },
      {
        title: "Weight Loss",
        description: "Goal to reduce body weight",
        category: "Health Goal",
      },
      {
        title: "Muscle Gain",
        description: "Goal to build muscle mass",
        category: "Health Goal",
      },
    ];
    console.log(`✨ Seeding ${goalsData.length} Goals...`);
    for (const data of goalsData) {
      await prisma.goals.upsert({
        where: { title: data.title }, // Identify by unique title
        update: {}, // No update if it exists
        create: data, // Create with all data if it doesn't exist
      });
    }
    console.log("✅ Goals seeded successfully.");

    // --- 3. Seed Dietary_Preferences ---
    // Make sure these 'name' values EXACTLY match what your frontend sends.
    // Ensure all boolean/array fields (isGlutenFree, Allergies, etc.) are included with defaults.
    const dietaryPreferencesData = [
      {
        name: "Vegan",
        isVegan: true,
        isVegetarian: true,
        isGlutenFree: false,
        isLactoseInt: false,
        isKeto: false,
      },
      {
        name: "Vegetarian",
        isVegan: false,
        isVegetarian: true,
        isGlutenFree: false,
        isLactoseInt: false,
        isKeto: false,
      },
      {
        name: "Gluten-Free",
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: true,
        isLactoseInt: false,
        isKeto: false,
      },
      {
        name: "Keto",
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
        isLactoseInt: false,
        isKeto: true,
      },
      {
        name: "Protein",
        isVegan: false,
        isVegetarian: false,
        isGlutenFree: false,
        isLactoseInt: false,
        isKeto: false,
      }, // Example: if "Protein" is a dietary pref
      {
        name: "Vegetables",
        isVegan: false,
        isVegetarian: true,
        isGlutenFree: false,
        isLactoseInt: false,
        isKeto: false,
      }, // Example: if "Vegetables" is a dietary pref
    ];
    console.log(
      `✨ Seeding ${dietaryPreferencesData.length} Dietary Preferences...`
    );
    for (const data of dietaryPreferencesData) {
      await prisma.dietary_Preferences.upsert({
        where: { name: data.name }, // Identify by unique name
        update: {},
        create: data,
      });
    }
    console.log("✅ Dietary Preferences seeded successfully.");
    const mealData = [
      // Sweetgreen
      {
        name: "Harvest Bowl",
        restaurant_name: "Sweetgreen",
        price: 12.95,
        image_url:
          "https://images.ctfassets.net/eum7w7yri3zr/Br3EYlf6srQYhCXdvOfwt/65b582e0c488a871e36cda2ea5e52df3/SG_Web_Image_Bowl_Harvest.png?w=600&fm=avif&q=75",
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
        dietary_pref_names: ["Gluten-Free", "Protein"],
      },
      {
        name: "Shroomami Bowl",
        restaurant_name: "Sweetgreen",
        price: 11.95,
        image_url:
          "https://images.ctfassets.net/eum7w7yri3zr/57c1vaLIB4WtuQXQblhUa5/5bbbf55c178b7985a03f994749445040/SG_Web_Image_Bowl_Shroomami.png?w=600&fm=avif&q=75",
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
        dietary_pref_names: ["Vegan", "Vegetables"],
      },

      // Mendocino Farms
      {
        name: "Impossible Taco Salad",
        restaurant_name: "Mendocino Farms",
        price: 13.5,
        image_url:
          "https://www.mendocinofarms.com/wp-content/uploads/2018/01/impossible-taco-salad-1080x675.png",
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
        dietary_pref_names: ["Vegetarian", "Gluten-Free"],
      },
      {
        name: "Peruvian Steak Sandwich",
        restaurant_name: "Mendocino Farms",
        price: 14.25,
        image_url:
          "https://photos.tryotter.com/cdn-cgi/image/fit=crop,width=984,height=534,quality=60,format=auto/menu-photos/80a3ace9-741b-46bf-99ae-c0d8292656bc.png",
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
        dietary_pref_names: ["Protein"],
      },

      // Wingstop
      {
        name: "Classic Wings (10 pcs)",
        restaurant_name: "Wingstop",
        price: 13.99,
        image_url:
          "https://cdn.bfldr.com/NDQASMJ1/as/wzskp78wwt6mxcpjkbkr3gb9/10_pc_Classic_Wings?auto=webp&format=png&width=900",
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
        dietary_pref_names: ["Keto", "Protein"],
      },
      {
        name: "Boneless Wings (10 pcs)",
        restaurant_name: "Wingstop",
        price: 12.99,
        image_url:
          "https://cdn.bfldr.com/NDQASMJ1/as/4w453948gr48fw6n2hkwczg/10_Boneless_Wings?auto=webp&format=png&width=900",
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
        dietary_pref_names: ["Protein"],
      },

      // Starbird
      {
        name: "Super Slaw Salad",
        restaurant_name: "Starbird",
        price: 11.75,
        image_url:
          "https://cdn.prod.website-files.com/5caa9a34f8e012d3d5e50127/5cb14bf12edee0e5ce7e72dc_sides-super-slaw.jpeg",
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
        dietary_pref_names: ["Vegetarian", "Gluten-Free"],
      },
      {
        name: "Crispy Chicken Sandwich",
        restaurant_name: "Starbird",
        price: 12.5,
        image_url:
          "https://cdn.prod.website-files.com/5caa9a34f8e012d3d5e50127/6492929fd771e6ed621b7cf9_bg%20png.png",
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
        dietary_pref_names: ["Protein"],
      },

  {
    name: "Chicken Rice Bowl",
    restaurant_name: "Umami Express",
    price: 11.95,
    image_url: "https://www.umamiexpress.com/images/chicken-bowl.jpg", // placeholder
    nutritional_information: {
      serving_size: 1,
      calories: 680,
      protein: 35,
      total_fat: 22,
      cholesterol: 80,
      sodium: 950,
      total_carbs: 70,
      sugars: 5,
    },
    dietary_pref_names: ["Protein", "Gluten-Free"],
  },
  {
    name: "Organic Tofu Rice Bowl",
    restaurant_name: "Umami Express",
    price: 11.95,
    image_url: "https://www.umamiexpress.com/images/tofu-bowl.jpg", // placeholder
    nutritional_information: {
      serving_size: 1,
      calories: 540,
      protein: 18,
      total_fat: 14,
      cholesterol: 0,
      sodium: 880,
      total_carbs: 65,
      sugars: 6,
    },
    dietary_pref_names: ["Vegan", "Gluten-Free"],
  },
  {
    name: "Everyday 6\" Turkey Sandwich",
    restaurant_name: "Crust - Fresh Sourdough Deli",
    price: 9.99,
    image_url: "https://www.crust.com/images/turkey-sandwich.jpg", // placeholder
    nutritional_information: {
      serving_size: 1,
      calories: 600,
      protein: 32,
      total_fat: 20,
      cholesterol: 50,
      sodium: 1200,
      total_carbs: 55,
      sugars: 4,
    },
    dietary_pref_names: ["Protein"],
  },
  {
    name: "The Farm Club",
    restaurant_name: "Mendocino Farms",
    price: 15.05,
    image_url: "https://mendocinofarms.com/images/farm-club.jpg", // placeholder
    nutritional_information: {
      serving_size: 1,
      calories: 750,
      protein: 36,
      total_fat: 34,
      cholesterol: 85,
      sodium: 1100,
      total_carbs: 60,
      sugars: 5,
    },
    dietary_pref_names: ["Protein"],
  },
  {
    name: "Hawaiian BBQ Chicken Plate",
    restaurant_name: "Big Daddy's Hawaiian BBQ",
    price: 15.00,
    image_url: "https://www.bigdaddyshawaiianbbq.com/images/hawaiian-bbq.jpg", // placeholder
    nutritional_information: {
      serving_size: 1,
      calories: 800,
      protein: 38,
      total_fat: 30,
      cholesterol: 90,
      sodium: 1350,
      total_carbs: 70,
      sugars: 10,
    },
    dietary_pref_names: [],
  },
  {
    name: "Large Fried Chicken Plate",
    restaurant_name: "Big Daddy's Hawaiian BBQ",
    price: 19.00,
    image_url: "https://www.bigdaddyshawaiianbbq.com/images/fried-chicken.jpg", // placeholder
    nutritional_information: {
      serving_size: 1,
      calories: 1000,
      protein: 45,
      total_fat: 50,
      cholesterol: 120,
      sodium: 1400,
      total_carbs: 75,
      sugars: 6,
    },
    dietary_pref_names: [],
  },
  {
    name: "Tea Leaf Salad",
    restaurant_name: "Burma Classic",
    price: 16.99,
    image_url: "https://burmaclassic.com/images/tea-leaf-salad.jpg", // placeholder
    nutritional_information: {
      serving_size: 1,
      calories: 420,
      protein: 8,
      total_fat: 22,
      cholesterol: 0,
      sodium: 400,
      total_carbs: 40,
      sugars: 4,
    },
    dietary_pref_names: ["Vegan", "Vegetarian", "Gluten-Free"],
  },
  {
    name: "Fiery Tofu & Vegetables",
    restaurant_name: "Burma Classic",
    price: 16.99,
    image_url: "https://burmaclassic.com/images/fiery-tofu.jpg", // placeholder
    nutritional_information: {
      serving_size: 1,
      calories: 500,
      protein: 20,
      total_fat: 18,
      cholesterol: 0,
      sodium: 950,
      total_carbs: 50,
      sugars: 8,
    },
    dietary_pref_names: ["Vegan", "Gluten-Free"],
  },
  {
    name: "Chicken Rice Bowl",
    restaurant_name: "Palmita",
    price: 10.35,
    image_url: "https://www.palmita.com/images/chicken-bowl.jpg", // placeholder
    nutritional_information: {
      serving_size: 1,
      calories: 670,
      protein: 30,
      total_fat: 20,
      cholesterol: 80,
      sodium: 850,
      total_carbs: 60,
      sugars: 5,
    },
    dietary_pref_names: ["Gluten-Free" ],
  },
  {
    name: "(V) Tofu Rice Bowl",
    restaurant_name: "Palmita",
    price: 9.95,
    image_url: "https://www.palmita.com/images/tofu-bowl.jpg", // placeholder
    nutritional_information: {
      serving_size: 1,
      calories: 530,
      protein: 18,
      total_fat: 14,
      cholesterol: 0,
      sodium: 700,
      total_carbs: 60,
      sugars: 6,
    },
    dietary_pref_names: ["Vegan", "Gluten-Free"],
  }
    ];

    console.log(`✨ Seeding ${mealData.length} Meals...`);

    for (const meal of mealData) {
      const createdMeal = await prisma.meals.create({
        data: {
          name: meal.name,
          restaurant_name: meal.restaurant_name,
          price: meal.price,
          image_url: meal.image_url ,
          nutritional_information: {
            create: meal.nutritional_information,
          },
          dietary_preferences: {
            connect: meal.dietary_pref_names.map((name) => ({ name })),
          },
          is_AI: false,
        },
        include: {
          nutritional_information: true,
          dietary_preferences: true,
        },
      });

      console.log(
        `✅ Added meal: ${createdMeal.name} from ${createdMeal.restaurant_name}`
      );
    }

    const snackData = [
      {
        name: "Banana",
        description: "Fresh banana – a naturally sweet and portable fruit.",
        image_url:
          "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
        wellness_category: ["Fruit", "Energy Boost", "Tired"],
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
        dietary_pref_names: ["Vegan", "Vegetarian", "Gluten-Free"],
      },
      {
        name: "100 Calorie SkinnyPop",
        description: "Pre-portioned popcorn bag made with simple ingredients.",
        image_url:
          "https://m.media-amazon.com/images/I/71DARoAdDGL.jpg",
        wellness_category: ["Low-Calorie", "Gluten-Free", "Stressed"],
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
        dietary_pref_names: ["Vegan", "Vegetarian", "Gluten-Free"],
      },
      {
        name: "Lay's Classic Chips",
        description: "Crispy, salty potato chips made from simple ingredients.",
        image_url:
          "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRzcVauV2E58508QyYHcc121kMT_csqAAOmyB1LGCDTqLp2Q9eB6mA_F4-yJB44I7mAej2j8pdY-9QGRLGK_wgPjSscd-ATZdAhT0BZw3Q88AGRJdsMUrbf4RuV5-U6Ce3QKyY-FQ&usqp=CAc",
        wellness_category: ["Snack", "Gluten-Free", "Stressed"],
        nutritional_info: {
          serving_size: 1,
          calories: 160,
          protein: 2,
          total_fat: 10,
          cholesterol: 0,
          sodium: 170,
          total_carbs: 15,
          sugars: 0,
        },
        dietary_pref_names: ["Vegetarian", "Gluten-Free"],
      },
      {
        name: "Lay's Baked Barbecue Chips",
        description: "Oven-baked chips with sweet and smoky barbecue flavor.",
        image_url:
          "https://i5.walmartimages.com/seo/Lay-s-Baked-Gluten-Free-Barbecue-Flavored-Potato-Chips-6-25-oz-Bag_7e161f6d-5f93-4453-8865-eb7e449828b7.b74beac7ae46a530afa71bf662ae84ce.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
        wellness_category: ["Low-Fat", "Baked", "Tired"],
        nutritional_info: {
          serving_size: 1,
          calories: 120,
          protein: 2,
          total_fat: 3,
          cholesterol: 0,
          sodium: 200,
          total_carbs: 23,
          sugars: 3,
        },
        dietary_pref_names: ["Vegetarian"],
      },
      {
        name: "Sun Chips Garden Salsa",
        description: "Whole grain chips with zesty garden salsa flavor.",
        image_url:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRvVaUIbGs6ouglRwDSU9ZQCVjPMxPzKR3w7zzs7Km_cCDBJdq4qBG2MjkpT1j8EuPdkgN6Jw89w0McKkP2UznxJtsVDae_RdO2dn1MsNPKR7aVyQzrn2qMyVNev5HJ4Q&usqp=CAc",
        wellness_category: ["Whole Grain", "Tired"],
        nutritional_info: {
          serving_size: 1,
          calories: 140,
          protein: 2,
          total_fat: 6,
          cholesterol: 0,
          sodium: 120,
          total_carbs: 19,
          sugars: 2,
        },
        dietary_pref_names: ["Vegetarian"],
      },
      {
        name: "Food Should Taste Good Blue Corn Chips",
        description:
          "Stone-ground blue corn tortilla chips made with flax and sunflower seeds.",
        image_url:
          "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTyTTv4ECS_Bj4zvtbEpt_Zn0li2ESJOXfo0jwTwlWNXGeLKszyXyrev-dO22wnkkCfBqmXT092p-_3KdW2NO7A1klYHeqq9GsumEUnjs0nS5ArtRtK9TvkKFZt4qM-N3YYyJ4onb8&usqp=CAc",
        wellness_category: [
          "Whole Grain",
          "Gluten-Free",
          "Non-GMO",
          "Stressed",
        ],
        nutritional_info: {
          serving_size: 1,
          calories: 140,
          protein: 2,
          total_fat: 7,
          cholesterol: 0,
          sodium: 80,
          total_carbs: 18,
          sugars: 0,
        },
        dietary_pref_names: ["Vegan", "Vegetarian", "Gluten-Free"],
      },
      {
        name: "Barbell Protein Bar - Cookies and Cream",
        description:
          "High-protein bar with a cookies and cream flavor, low in sugar.",
        image_url:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRZnejHBbEh5V83pQ2b905FybSLAY3DyxZamOuaoBwE9BANXHTF_UC4LDOaXVKZrQdHNNj4OJ2a5srkOYliwwD_nVjrml__XtZ0LEZGZwMfHmH_beT_8FRXi8BxsNDH&usqp=CAc",
        wellness_category: ["High-Protein", "Low-Sugar", "Tired"],
        nutritional_info: {
          serving_size: 1,
          calories: 200,
          protein: 20,
          total_fat: 8,
          cholesterol: 5,
          sodium: 150,
          total_carbs: 20,
          sugars: 1,
        },
        dietary_pref_names: ["Vegetarian", "Gluten-Free"],
      },
      {
        name: "Barbell Protein Bar - Caramel Cashew",
        description:
          "Chewy caramel protein bar with cashew flavor and no added sugar.",
        image_url:
          "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRhz_BbNsD3YHMkmWCmTsczYQPdUecjSR6z1yb33sgXy_n5FuFLZ2eeeOkHSBjBXBEk3IK8hp7ZKPyTERaRv1cfoqpeViEoEiAp8Ts67APy4reqwwwL_9YdP81O6eDLP-KQICa4XQ&usqp=CAc",
        wellness_category: ["High-Protein", "Low-Sugar", "Tired"],
        nutritional_info: {
          serving_size: 1,
          calories: 200,
          protein: 20,
          total_fat: 7,
          cholesterol: 5,
          sodium: 160,
          total_carbs: 22,
          sugars: 2,
        },
        dietary_pref_names: ["Vegetarian", "Gluten-Free"],
      },
      {
    name: "Think Jerky 80 Cal Beef Stick",
    description:
      "80-calorie beef jerky stick made with grass-fed beef and minimal ingredients. Allergies include: soy and other potential preservatives.",
    image_url:
      "https://m.media-amazon.com/images/I/81AaCwhYKLL._SX679_.jpg",
    wellness_category: ["High-Protein", "Low-Carb", "Tired"],
    nutritional_info: {
      serving_size: 1,
      calories: 80,
      protein: 6,
      total_fat: 5,
      cholesterol: 20,
      sodium: 300,
      total_carbs: 1,
      sugars: 0,
    },
    dietary_pref_names: ["Keto", "Gluten-Free"],
  },
  {
    name: "Mango Fruit Stick",
    description:
      "Dried mango fruit stick with no added sugar and full of natural vitamins. Allergies include: none (check packaging for sulfites).",
    image_url:
      "https://m.media-amazon.com/images/I/71DLvud+SCL._SX679_.jpg",
    wellness_category: ["Low-Calorie", "Energizing", "Stressed"],
    nutritional_info: {
      serving_size: 1,
      calories: 60,
      protein: 0,
      total_fat: 0,
      cholesterol: 0,
      sodium: 0,
      total_carbs: 15,
      sugars: 13,
    },
    dietary_pref_names: ["Vegan", "Gluten-Free"],
  },
  {
    name: "Cooper Blueberry Pomegranate Bars",
    description:
      "Blueberry pomegranate fruit and nut bar for a sweet and chewy snack. Allergies include: tree nuts, soy, and possibly milk.",
    image_url:
      "https://images.heb.com/is/image/HEBGrocery/003094175",
    wellness_category: ["Antioxidant-Rich", "Stressed", "Low-Sugar"],
    nutritional_info: {
      serving_size: 1,
      calories: 150,
      protein: 3,
      total_fat: 6,
      cholesterol: 0,
      sodium: 50,
      total_carbs: 20,
      sugars: 8,
    },
    dietary_pref_names: ["Vegetarian", "Gluten-Free"],
  },
  {
    name: "Peach",
    description:
      "Fresh peach, high in fiber and vitamins. Naturally sweet and refreshing. Allergies include: none (cross-reactivity with birch pollen possible).",
    image_url:
      "https://m.media-amazon.com/images/I/61VLoztAFrL._SX679_.jpg",
    wellness_category: ["Low-Calorie", "Hydrating", "Stressed"],
    nutritional_info: {
      serving_size: 1,
      calories: 70,
      protein: 1,
      total_fat: 0,
      cholesterol: 0,
      sodium: 0,
      total_carbs: 17,
      sugars: 15,
    },
    dietary_pref_names: ["Vegan", "Gluten-Free"],
  },
  {
    name: "Chocolate Pretzels",
    description:
      "Crunchy pretzels coated in milk chocolate. Sweet and salty combo snack. Allergies include: wheat, milk, soy.",
    image_url:
      "https://m.media-amazon.com/images/I/81FSUUM84rL._SX679_.jpg",
    wellness_category: ["Comfort Food", "Stressed"],
    nutritional_info: {
      serving_size: 1,
      calories: 180,
      protein: 2,
      total_fat: 8,
      cholesterol: 5,
      sodium: 200,
      total_carbs: 26,
      sugars: 12,
    },
    dietary_pref_names: ["Vegetarian"],
  },
  {
    name: "Honey Nut Cheerios",
    description:
      "Honey Nut Cheerios made with whole grain oats and lightly sweetened. Allergies include: almonds, wheat.",
    image_url:
      "https://m.media-amazon.com/images/I/81vwF50I3BL._SX679_.jpg",
    wellness_category: ["Heart-Healthy", "Low-Fat", "Tired"],
    nutritional_info: {
      serving_size: 1,
      calories: 140,
      protein: 3,
      total_fat: 2,
      cholesterol: 0,
      sodium: 190,
      total_carbs: 29,
      sugars: 9,
    },
    dietary_pref_names: ["Vegetarian"],
  },
  {
    name: "Special K with Strawberries",
    description:
      "Crispy rice flakes with dried strawberries. A classic low-fat breakfast choice. Allergies include: wheat, soy, milk.",
    image_url:
      "https://m.media-amazon.com/images/I/91KFe2X8q1L._SX679_.jpg",
    wellness_category: ["Low-Fat", "Tired", "Heart-Healthy"],
    nutritional_info: {
      serving_size: 1,
      calories: 120,
      protein: 2,
      total_fat: 0.5,
      cholesterol: 0,
      sodium: 220,
      total_carbs: 27,
      sugars: 9,
    },
    dietary_pref_names: ["Vegetarian"],
  },
  {
    name: "Gummy Bears",
    description:
      "Classic chewy gummy candy. Great for a sweet pick-me-up. Allergies include: gelatin (animal product), may contain wheat or soy.",
    image_url:
      "https://m.media-amazon.com/images/I/81G2caz-IiL._SX679_.jpg",
    wellness_category: ["Comfort Food", "Stressed"],
    nutritional_info: {
      serving_size: 1,
      calories: 140,
      protein: 2,
      total_fat: 0,
      cholesterol: 0,
      sodium: 15,
      total_carbs: 34,
      sugars: 23,
    },
    dietary_pref_names: [],
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
            create: snack.nutritional_info,
          },
          dietary_preferences: {
            connect: snack.dietary_pref_names.map((name) => ({ name })),
          },
        },
        include: {
          nutritional_info: true,
          dietary_preferences: true,
        },
      });

      console.log(`✅ Added snack: ${createdSnack.name}`);
    }
    console.log("\n🎉 All specified seeding complete!");
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1); // Exit with error code if seeding fails
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client disconnects
    console.log("🔌 Prisma client disconnected.");
  }
}

// Execute the seed function
seed();
