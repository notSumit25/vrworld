-- DropForeignKey
ALTER TABLE "_UserRooms" DROP CONSTRAINT "_UserRooms_A_fkey";

-- CreateTable
CREATE TABLE "GlobalRoom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "GlobalRoom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "_UserRooms" ADD CONSTRAINT "_UserRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "GlobalRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
