"use client";

import axios from "axios";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import Avatar from "@/app/components/Avatar";
import { BsChatDots } from "react-icons/bs";

interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post("/api/conversations", {
        userId: data.id,
      })
      .then((response) => {
        router.push(`/conversations/${response.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <div
      onClick={handleClick}
      className={`
        w-full
        relative
        flex
        items-center
        justify-between
        gap-3
        p-3
        rounded-xl
        cursor-pointer
        transition-all
        duration-200
        border
        bg-slate-900/40
        border-slate-800/40
        hover:bg-slate-800/60
        hover:border-slate-700/60
        group
        ${isLoading ? "opacity-60 pointer-events-none" : ""}
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar user={data} size="md" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-200 group-hover:text-slate-100 truncate">
            {data.name || "User"}
          </p>
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {data.email}
          </p>
        </div>
      </div>

      <div className="p-2 rounded-lg bg-slate-800/50 text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-600/20 transition-colors">
        <BsChatDots size={16} />
      </div>
    </div>
  );
};

export default UserBox;
