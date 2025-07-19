/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Goals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Goals_title_key" ON "Goals"("title");
