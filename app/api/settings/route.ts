import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new NextResponse("Invalid JSON", { status: 400 });
    }

    const { name, image } = body || {};

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image: image !== undefined ? image : currentUser.image,
        name: name !== undefined ? name : currentUser.name,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("ERROR_SETTINGS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
