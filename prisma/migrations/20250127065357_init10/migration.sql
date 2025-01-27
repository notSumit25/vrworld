/*
  Warnings:

  - Added the required column `mapId` to the `GlobalRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GlobalRoom" ADD COLUMN     "Avatars" JSONB[],
ADD COLUMN     "mapId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "GlobalRoom" ADD CONSTRAINT "GlobalRoom_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
