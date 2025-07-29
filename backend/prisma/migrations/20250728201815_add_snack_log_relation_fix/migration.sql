-- CreateTable
CREATE TABLE "SnackLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "snackId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SnackLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SnackLog_userId_snackId_date_key" ON "SnackLog"("userId", "snackId", "date");

-- AddForeignKey
ALTER TABLE "SnackLog" ADD CONSTRAINT "SnackLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnackLog" ADD CONSTRAINT "SnackLog_snackId_fkey" FOREIGN KEY ("snackId") REFERENCES "Snacks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
