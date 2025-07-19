-- AlterTable
ALTER TABLE "User" ADD COLUMN     "caloric_goal" INTEGER NOT NULL DEFAULT 2000,
ADD COLUMN     "daysOfWeek" TEXT[];
