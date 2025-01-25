/*
  Warnings:

  - You are about to drop the column `theme` on the `GlobalRoom` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GlobalRoom" DROP COLUMN "theme";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "theme";
