-- DropForeignKey
ALTER TABLE "_UserRooms" DROP CONSTRAINT "_UserRooms_A_fkey";

-- CreateTable
CREATE TABLE "_GlobalRooms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GlobalRooms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GlobalRooms_B_index" ON "_GlobalRooms"("B");

-- AddForeignKey
ALTER TABLE "_UserRooms" ADD CONSTRAINT "_UserRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalRooms" ADD CONSTRAINT "_GlobalRooms_A_fkey" FOREIGN KEY ("A") REFERENCES "GlobalRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalRooms" ADD CONSTRAINT "_GlobalRooms_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
