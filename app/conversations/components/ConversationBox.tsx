"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import clsx from "clsx";

import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import { formatMessageTime } from "@/app/libs/date";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) return false;
    const seenArray = lastMessage.seen || [];
    if (!userEmail) return false;
    return seenArray.some((user) => user.email === userEmail);
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) return "Sent an image";
    if (lastMessage?.body) return lastMessage.body;
    return "Started a dialogue";
  }, [lastMessage]);

  const timestamp = useMemo(() => {
    return formatMessageTime(lastMessage?.createdAt);
  }, [lastMessage?.createdAt]);

  const title = data.name || otherUser.name || "Conversation";

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full
        relative
        flex
        items-center
        gap-3
        p-3
        rounded-xl
        cursor-pointer
        transition-all
        duration-200
        border
        text-left
      `,
        selected
          ? "bg-indigo-600/15 border-indigo-500/40 shadow-sm"
          : "bg-slate-900/40 border-slate-800/40 hover:bg-slate-800/60 hover:border-slate-700/60"
      )}
    >
      {/* Active conversation indicator pill */}
      {selected && (
        <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />
      )}

      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} size="md" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex justify-between items-baseline mb-1">
          <p
            className={clsx(
              "text-sm font-semibold truncate",
              selected ? "text-slate-100" : "text-slate-200"
            )}
          >
            {title}
          </p>
          {timestamp && (
            <span className="text-[11px] font-normal text-slate-400 shrink-0 ml-2">
              {timestamp}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <p
            className={clsx(
              "truncate text-xs leading-relaxed",
              !hasSeen
                ? "text-indigo-300 font-medium"
                : "text-slate-400 font-normal"
            )}
          >
            {lastMessageText}
          </p>

          {!hasSeen && (
            <span
              title="Unread"
              className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_6px_rgba(99,102,241,0.8)]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
