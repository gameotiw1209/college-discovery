/*
  Warnings:

  - You are about to drop the column `campusRating` on the `College` table. All the data in the column will be lost.
  - Added the required column `nirfRanking` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placements` to the `College` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "College" DROP COLUMN "campusRating",
ADD COLUMN     "nirfRanking" INTEGER NOT NULL,
ADD COLUMN     "placements" JSONB NOT NULL;
