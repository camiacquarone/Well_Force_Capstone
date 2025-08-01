/*
  Warnings:

  - Changed the type of `userId` on the `MealLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `SnackLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "MealLog" DROP CONSTRAINT "MealLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "SnackLog" DROP CONSTRAINT "SnackLog_userId_fkey";

-- AlterTable
ALTER TABLE "MealLog" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SnackLog" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MealLog_userId_mealId_date_key" ON "MealLog"("userId", "mealId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SnackLog_userId_snackId_date_key" ON "SnackLog"("userId", "snackId", "date");

-- AddForeignKey
ALTER TABLE "SnackLog" ADD CONSTRAINT "SnackLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLog" ADD CONSTRAINT "MealLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
