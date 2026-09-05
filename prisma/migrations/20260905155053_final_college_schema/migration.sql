/*
  Warnings:

  - You are about to drop the column `placements` on the `College` table. All the data in the column will be lost.
  - Added the required column `campusRating` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `campusSize` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facilities` to the `College` table without a default value. This is not possible if the table is not empty.
  - Added the required column `placementRate` to the `College` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "College" DROP COLUMN "placements",
ADD COLUMN     "campusRating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "campusSize" INTEGER NOT NULL,
ADD COLUMN     "facilities" JSONB NOT NULL,
ADD COLUMN     "placementRate" DOUBLE PRECISION NOT NULL;
