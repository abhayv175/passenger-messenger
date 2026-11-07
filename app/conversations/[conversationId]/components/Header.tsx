"use client";

import { Conversation, User } from "@prisma/client";
import useOtherUser from "@/app/hooks/useOtherUser";
import { useMemo, useState } from "react";
import Link from "next/link";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";
import ProfileDrawer from "./ProfileDrawer";
import useActiveList from "@/app/hooks/useActiveList";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email || "") !== -1;

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }
    return isActive ? "Active now" : "Offline";
  }, [conversation, isActive]);

  const title = conversation.name || otherUser.name || "Conversation";

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className="
          backdrop-blur-xl
          bg-slate-900/80
          border-b
          border-slate-800/70
          w-full
          flex
          py-3
          px-4
          sm:px-6
          justify-between
          items-center
          shadow-lg
          z-20
        "
      >
        <div className="flex gap-3 items-center">
          <Link
            className="
              lg:hidden
              p-1.5
              -ml-1
              rounded-lg
              text-slate-400
              hover:text-indigo-400
              hover:bg-slate-800
              transition
              cursor-pointer
            "
            href="/conversations"
          >
            <HiChevronLeft size={24} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} size="md" />
          )}
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-slate-100 leading-tight">
              {title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              {!conversation.isGroup && isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
              <span>{statusText}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setDrawerOpen(true)}
          title="Conversation options"
          className="
            p-2
            rounded-xl
            text-slate-400
            hover:text-slate-200
            hover:bg-slate-800
            border
            border-transparent
            hover:border-slate-700/60
            transition-all
            cursor-pointer
          "
        >
          <HiEllipsisHorizontal size={24} />
        </button>
      </div>
    </>
  );
};

export default Header;
