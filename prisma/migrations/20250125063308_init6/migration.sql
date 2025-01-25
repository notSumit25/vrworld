/*
  Warnings:

  - You are about to drop the column `appearance` on the `Avatar` table. All the data in the column will be lost.
  - Added the required column `image` to the `Avatar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Avatar" DROP COLUMN "appearance",
ADD COLUMN     "image" TEXT NOT NULL;
