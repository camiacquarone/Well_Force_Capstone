-- DropForeignKey
ALTER TABLE "MealLog" DROP CONSTRAINT "MealLog_userId_fkey";

-- AlterTable
ALTER TABLE "MealLog" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "MealLog" ADD CONSTRAINT "MealLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
