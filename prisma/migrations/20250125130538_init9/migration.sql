/*
  Warnings:

  - The primary key for the `GlobalRoom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Room` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_GlobalRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_UserRooms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `GlobalRoom` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Room` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_GlobalRooms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_UserRooms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_GlobalRooms" DROP CONSTRAINT "_GlobalRooms_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserRooms" DROP CONSTRAINT "_UserRooms_A_fkey";

-- AlterTable
ALTER TABLE "GlobalRoom" DROP CONSTRAINT "GlobalRoom_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "GlobalRoom_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Room" DROP CONSTRAINT "Room_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Room_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_GlobalRooms" DROP CONSTRAINT "_GlobalRooms_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL,
ADD CONSTRAINT "_GlobalRooms_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "_UserRooms" DROP CONSTRAINT "_UserRooms_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL,
ADD CONSTRAINT "_UserRooms_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "_UserRooms" ADD CONSTRAINT "_UserRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalRooms" ADD CONSTRAINT "_GlobalRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "GlobalRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
