import PusherServer from "pusher";
import PusherClient from "pusher-js";

const cluster =
  process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ||
  process.env.PUSHER_CLUSTER ||
  "eu";

const appId = process.env.PUSHER_APP_ID || "";
const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "";
const secret = process.env.PUSHER_APP_SECRET || process.env.PUSHER_SECRET || "";

export const pusherServer = new PusherServer({
  appId,
  key,
  secret,
  cluster,
  useTLS: true,
});

export const pusherClient = new PusherClient(key, {
  channelAuthorization: {
    endpoint: "/api/pusher/auth",
    transport: "ajax",
  },
  cluster,
});

/**
 * Safely trigger a Pusher event without crashing the HTTP request
 * if Pusher credentials are not configured or socket rejects.
 */
export const triggerPusher = async (
  channel: string | string[],
  event: string,
  data: any
) => {
  try {
    if (appId && key && secret) {
      await pusherServer.trigger(channel, event, data);
    }
  } catch (error) {
    console.error(`[Pusher] Trigger failed for channel ${channel} / event ${event}:`, error);
  }
};
