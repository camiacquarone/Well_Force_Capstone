/*
  Warnings:

  - Added the required column `name` to the `Dietary_Preferences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dietary_Preferences" ADD COLUMN     "name" TEXT NOT NULL;
