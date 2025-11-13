import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(req, res) {
  const { isAuthenticated, redirectToSignIn, userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" });
  }

  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "User data not found" });
    }

    // console.log(user);
    // console.log(user.emailAddresses[0].emailAddress);
    const { firstName, id: clerkId, emailAddresses, imageUrl, username } = user;
    // console.log(firstName, id, imageUrl, username);
    const email = emailAddresses[0].emailAddress;

    if (!email) {
      return NextResponse.json({ error: "User email not found" });
    }
    // console.log(await prisma.user.findMany());
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });
    const findUser = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });
    console.log(findUser);
    if (findUser) {
      return NextResponse.json({ user: findUser });
    }

    const newUser = await prisma.user.upsert({
      where: { clerkId: clerkId },
      update: {},
      create: {
        name: firstName,
        email: email,
        clerkId: clerkId,
      },
    });

    return NextResponse.json({ user: newUser });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal server error" });
  }
}

// Get User

export async function GET(req, res) {
  const { isAuthenticated, redirectToSignIn, userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        rooms: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }
    return NextResponse.json({ user });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal server error" });
  }
}
