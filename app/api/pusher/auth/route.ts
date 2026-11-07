import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { pusherServer } from "@/app/libs/pusher";
import { authOptions } from "@/app/libs/authOptions";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let socketId: string | null = null;
    let channel: string | null = null;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      socketId = formData.get("socket_id") as string | null;
      channel = formData.get("channel_name") as string | null;
    } else if (contentType.includes("application/json")) {
      const json = await request.json();
      socketId = json?.socket_id ?? null;
      channel = json?.channel_name ?? null;
    } else {
      // Fallback: try parsing body text as url-encoded or json
      const bodyText = await request.text();
      try {
        const json = JSON.parse(bodyText);
        socketId = json?.socket_id ?? null;
        channel = json?.channel_name ?? null;
      } catch {
        const params = new URLSearchParams(bodyText);
        socketId = params.get("socket_id");
        channel = params.get("channel_name");
      }
    }

    if (!socketId || !channel) {
      return new NextResponse("Missing socket_id or channel_name", { status: 400 });
    }

    const data = {
      user_id: session.user.email,
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("PUSHER_AUTH_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

