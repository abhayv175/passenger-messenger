import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { triggerPusher } from "@/app/libs/pusher";

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

    const { message, image, conversationId } = body || {};

    if (!conversationId) {
      return new NextResponse("Missing conversationId", { status: 400 });
    }

    if (!message && !image) {
      return new NextResponse("Message body or image is required", { status: 400 });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    await triggerPusher(conversationId, "messages:new", newMessage);

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.forEach((user) => {
      if (user.email) {
        triggerPusher(user.email, "conversation:update", {
          id: conversationId,
          messages: [lastMessage],
        });
      }
    });

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.error("ERROR_MESSAGES", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
