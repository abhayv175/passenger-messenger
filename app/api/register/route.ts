import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body || {};

    if (!email || !name || !password) {
      return new NextResponse("Missing information", { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findFirst({
      where: {
        email: { equals: cleanEmail, mode: "insensitive" },
      },
    });

    if (existingUser) {
      if (!existingUser.hashedPassword) {
        // User originally signed up via OAuth (Google) - set their password now so they can sign in both ways
        const hashedPassword = await bcrypt.hash(password, 12);
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            hashedPassword,
            name: existingUser.name || name,
          },
        });
        return NextResponse.json(updatedUser);
      }
      return new NextResponse("Email already registered. Please sign in.", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
