/*
  Warnings:

  - Added the required column `overview` to the `College` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "College" ADD COLUMN     "overview" TEXT NOT NULL;
