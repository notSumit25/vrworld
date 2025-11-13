import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

// Create or Fetch a Room
export async function POST(req) {
  try {
    // Clerk authentication
    console.log("Authenticating user in /api/Room/user");
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }
    console.log("User authenticated:", userId);
    const { roomId } = await req.json();
    console.log("Requested roomId:", roomId);
    if (!roomId) {
      return NextResponse.json(
        { error: "roomId is required" },
        { status: 400 }
      );
    }

    // Verify user exists in your database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    console.log("Fetched user from DB:", user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Try to find a private room first
    let type = "room";
    let room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { users: true, Map: true },
    });
    console.log("Fetched room from DB:", room);

    // If not found, check global rooms
    if (!room) {
      room = await prisma.globalRoom.findUnique({
        where: { id: roomId },
        include: { users: true, Map: true },
      });
      type = "globalRoom";
    }
    console.log("Final room object:", room);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Map user IDs → avatar IDs from room.Avatars
    const userAvatarMap = new Map();
    if (room.Avatars && Array.isArray(room.Avatars)) {
      room.Avatars.forEach((entry) => {
        if (entry && typeof entry === "object" && entry.user && entry.avatar) {
          userAvatarMap.set(entry.user, entry.avatar);
        }
      });
    }

    // Fetch all avatars from DB
    const allAvatars = await prisma.avatar.findMany();
    console.log("Fetched all avatars from DB:", allAvatars);
    const avatarMap = new Map(allAvatars.map((a) => [a.id, a]));

    // Build user-avatar pairs
    const usersWithAvatars =
      room.users?.map((u) => ({
        user: {
          id: u.id,
          name: u.name || "Unknown",
          email: u.email || "No email",
        },
        avatar: avatarMap.get(userAvatarMap.get(u.id)) || null,
      })) || [];

    // Prisma objects sometimes contain BigInt / Decimal — fix serialization
    const safeRoom = JSON.parse(JSON.stringify(room));

    return NextResponse.json({
      users: usersWithAvatars,
      room: safeRoom,
      type,
    });
  } catch (error) {
    console.error("Error in /api/Room/user:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error?.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
