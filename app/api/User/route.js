import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, res) {
  const { userId } = getAuth(req);
  console.log(userId);
  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" });
  }

  try {
    const user = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }).then((res) => res.json());

    //   console.log(user);
    const { first_name, id, email_addresses, image_url, username } = user;
    const email = email_addresses[0]?.email_address;

    const findUser = await prisma.user.findUnique({
      where: {
        clerkId: id,
      },
    });

    if (findUser) {
      return NextResponse.json({ user: findUser });
    }

    const newUser = await prisma.user.upsert({
      where: { clerkId: id },
      update: {},
      create: {
        name: first_name,
        email: email,
        clerkId: id,
      },
    });

    return NextResponse.status(200).json({ user: newUser });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: "Internal server error" });
  }
}
