"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { HiOutlineClipboardDocument, HiOutlineCheck } from "react-icons/hi2";
import ImageModal from "./ImageModal";
import { formatTimeOnly } from "@/app/libs/date";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const REACTIONS = ["❤️", "👍", "😂", "🔥", "🚀"];

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isOwn = session?.data?.user?.email === data?.sender?.email;

  const seenUsers = (data.seen || []).filter(
    (user) => user.email !== data?.sender?.email
  );

  const formattedTime = formatTimeOnly(data.createdAt);

  const handleCopy = () => {
    if (data.body) {
      navigator.clipboard.writeText(data.body);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReaction = (emoji: string) => {
    setSelectedReaction((prev) => (prev === emoji ? null : emoji));
  };

  return (
    <div
      className={clsx(
        "group/msg relative flex gap-3 px-4 py-2 transition-colors",
        isOwn && "justify-end"
      )}
    >
      {/* Sender Avatar for incoming messages */}
      {!isOwn && (
        <div className="shrink-0 self-end mb-1">
          <Avatar user={data.sender} size="sm" />
        </div>
      )}

      <div
        className={clsx(
          "flex flex-col gap-1 max-w-[82%] sm:max-w-[70%]",
          isOwn ? "items-end" : "items-start"
        )}
      >
        {/* Sender name & timestamp header */}
        <div className="flex items-center gap-2 px-1">
          {!isOwn && (
            <span className="text-xs font-medium text-slate-300">
              {data.sender.name}
            </span>
          )}
          {formattedTime && (
            <span className="text-[11px] font-normal text-slate-400">
              {formattedTime}
            </span>
          )}
        </div>

        {/* Message Bubble Container with Hover Micro-actions */}
        <div className="relative group/bubble">
          {/* Hover Micro-Actions Dock */}
          <div
            className={clsx(
              `
              absolute
              top-0
              -translate-y-full
              pb-1.5
              hidden
              group-hover/bubble:flex
              items-center
              gap-1
              z-20
              transition-opacity
            `,
              isOwn ? "right-0" : "left-0"
            )}
          >
            <div className="flex items-center gap-0.5 px-2 py-1 rounded-full backdrop-blur-xl bg-slate-900/90 border border-slate-700/70 shadow-xl">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handleReaction(emoji)}
                  className="hover:scale-125 transition-transform text-sm p-0.5 rounded-full hover:bg-slate-800"
                >
                  {emoji}
                </button>
              ))}
              {data.body && (
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy text"
                  className="ml-1 p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
                >
                  {copied ? (
                    <HiOutlineCheck size={13} className="text-emerald-400" />
                  ) : (
                    <HiOutlineClipboardDocument size={13} />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Image Modal */}
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />

          {/* Actual Bubble Geometry */}
          <div
            className={clsx(
              "text-sm overflow-hidden transition-all duration-150 leading-relaxed",
              data.image
                ? "rounded-2xl p-1 bg-slate-900/40 border border-slate-800/80"
                : isOwn
                ? "bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 shadow-md shadow-indigo-950/40"
                : "bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-2xl rounded-bl-sm px-4 py-2.5 backdrop-blur-md shadow-sm"
            )}
          >
            {data.image ? (
              <div className="relative overflow-hidden rounded-xl group/img">
                <Image
                  onClick={() => setImageModalOpen(true)}
                  alt="Attachment"
                  height={288}
                  width={288}
                  sizes="(max-width: 768px) 250px, 288px"
                  src={data.image}
                  className="
                    object-cover
                    rounded-xl
                    cursor-pointer
                    transition-transform
                    duration-300
                    group-hover/img:scale-105
                  "
                />
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words">{data.body}</p>
            )}
          </div>

          {/* Selected Reaction Badge */}
          {selectedReaction && (
            <div
              className={clsx(
                "absolute -bottom-2.5 flex items-center px-1.5 py-0.5 rounded-full text-xs backdrop-blur-md bg-slate-900/90 border border-slate-700/70 shadow-md",
                isOwn ? "left-2" : "right-2"
              )}
            >
              <span>{selectedReaction}</span>
            </div>
          )}
        </div>

        {/* "Seen by" receipt mini-avatars resting elegantly below last message */}
        {isLast && isOwn && seenUsers.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5 pr-1">
            <span className="text-[11px] text-slate-400 font-light">
              Seen by
            </span>
            <div className="flex -space-x-1.5 overflow-hidden">
              {seenUsers.slice(0, 4).map((user) => (
                <div
                  key={user.id}
                  title={user.name || user.email || "Seen"}
                  className="inline-block"
                >
                  <Avatar user={user} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Own user Avatar for outgoing messages */}
      {isOwn && (
        <div className="shrink-0 self-end mb-1">
          <Avatar user={data.sender} size="sm" />
        </div>
      )}
    </div>
  );
};

export default MessageBox;
