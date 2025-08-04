-- DropForeignKey
ALTER TABLE "SnackLog" DROP CONSTRAINT "SnackLog_userId_fkey";

-- AlterTable
ALTER TABLE "SnackLog" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "SnackLog" ADD CONSTRAINT "SnackLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
