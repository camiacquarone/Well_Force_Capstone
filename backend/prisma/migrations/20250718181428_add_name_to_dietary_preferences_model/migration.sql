/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Dietary_Preferences` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Dietary_Preferences_name_key" ON "Dietary_Preferences"("name");
