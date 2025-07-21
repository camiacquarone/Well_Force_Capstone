-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "allergies" TEXT[],
    "role" TEXT NOT NULL,
    "caloric_goal" INTEGER NOT NULL DEFAULT 2000,
    "daysOfWeek" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goals" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dietary_Preferences" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isGlutenFree" BOOLEAN,
    "isLactoseInt" BOOLEAN,
    "isVegan" BOOLEAN,
    "isVegetarian" BOOLEAN,
    "isKeto" BOOLEAN,
    "userId" INTEGER,
    "snacksId" INTEGER,
    "mealsId" INTEGER,

    CONSTRAINT "Dietary_Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snacks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "description" TEXT NOT NULL,
    "wellness_category" TEXT[],

    CONSTRAINT "Snacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "restaurant_name" TEXT NOT NULL,

    CONSTRAINT "Meals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nutritional_Information" (
    "id" SERIAL NOT NULL,
    "serving_size" INTEGER,
    "calories" INTEGER,
    "total_fat" INTEGER,
    "cholesterol" INTEGER,
    "sodium" INTEGER,
    "total_carbs" INTEGER,
    "protein" INTEGER,
    "sugars" INTEGER,
    "snacksId" INTEGER,
    "mealsId" INTEGER,

    CONSTRAINT "Nutritional_Information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "UserId" INTEGER NOT NULL,
    "mealId" INTEGER NOT NULL,
    "status" TEXT,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benefits" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "availabe_for" TEXT NOT NULL,

    CONSTRAINT "Benefits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Goals_title_key" ON "Goals"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Dietary_Preferences_name_key" ON "Dietary_Preferences"("name");

-- AddForeignKey
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dietary_Preferences" ADD CONSTRAINT "Dietary_Preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dietary_Preferences" ADD CONSTRAINT "Dietary_Preferences_snacksId_fkey" FOREIGN KEY ("snacksId") REFERENCES "Snacks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dietary_Preferences" ADD CONSTRAINT "Dietary_Preferences_mealsId_fkey" FOREIGN KEY ("mealsId") REFERENCES "Meals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutritional_Information" ADD CONSTRAINT "Nutritional_Information_snacksId_fkey" FOREIGN KEY ("snacksId") REFERENCES "Snacks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nutritional_Information" ADD CONSTRAINT "Nutritional_Information_mealsId_fkey" FOREIGN KEY ("mealsId") REFERENCES "Meals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
