"use client";

import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MdOutlineGroupAdd } from "react-icons/md";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

import useConversation from "@/app/hooks/useConversation";
import { FullConversationType } from "@/app/types";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  // Keyboard shortcut Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    const channel = pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }
        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }
          return currentConversation;
        })
      );
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });

      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    channel.bind("conversation:new", newHandler);
    channel.bind("conversation:update", updateHandler);
    channel.bind("conversation:remove", removeHandler);

    return () => {
      channel.unbind("conversation:new", newHandler);
      channel.unbind("conversation:update", updateHandler);
      channel.unbind("conversation:remove", removeHandler);
      pusherClient.unsubscribe(pusherKey);
    };
  }, [pusherKey, conversationId, router]);

  // Filter conversations by search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => {
      if (item.name && item.name.toLowerCase().includes(q)) return true;
      return item.users.some(
        (u) =>
          u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      );
    });
  }, [items, searchQuery]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `
          fixed
          inset-y-0
          pb-20
          lg:pb-0
          lg:left-20
          lg:w-80
          xl:w-96
          lg:block
          overflow-y-auto
          backdrop-blur-xl
          bg-slate-900/70
          border-r
          border-slate-800/70
          transition-all
          duration-200
        `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-100">
                Messages
              </h1>
              {items.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                  {items.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              title="Create Group Chat"
              className="
                p-2
                rounded-xl
                bg-slate-800/80
                hover:bg-indigo-600/20
                text-slate-300
                hover:text-indigo-400
                border
                border-slate-700/60
                hover:border-indigo-500/40
                transition-all
                duration-200
                cursor-pointer
              "
            >
              <MdOutlineGroupAdd size={20} />
            </button>
          </div>

          {/* Dynamic Search Input with Cmd/Ctrl + K hint */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <HiMagnifyingGlass size={18} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="
                w-full
                rounded-xl
                bg-slate-950/60
                border
                border-slate-800
                pl-9
                pr-16
                py-2
                text-sm
                text-slate-100
                placeholder:text-slate-500
                focus:outline-none
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-500/25
                transition-all
              "
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
              >
                <HiXMark size={16} />
              </button>
            ) : (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800">
                  ⌘K
                </kbd>
              </div>
            )}
          </div>

          {/* Conversation List Items */}
          <div className="flex flex-col gap-1.5 mt-1">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 px-4">
                <p className="text-sm text-slate-400">
                  {searchQuery ? "No conversations match your query" : "No conversations yet"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {searchQuery ? "Try a different search term" : "Start a chat from the People tab"}
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <ConversationBox
                  key={item.id}
                  data={item}
                  selected={conversationId === item.id}
                />
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
