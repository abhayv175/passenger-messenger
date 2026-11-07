'use client';

import Image from "next/image";
import { User } from "@prisma/client";
import useActiveList from "../hooks/useActiveList";
import { useState } from "react";

interface AvatarProps {
  user?: User | null;
  size?: "sm" | "md" | "lg";
}

const Avatar: React.FC<AvatarProps> = ({ user, size = "md" }) => {
  const { members } = useActiveList();
  const [imageError, setImageError] = useState(false);
  const isActive = members.indexOf(user?.email || "") !== -1;

  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-9 w-9 md:h-10 md:w-10 text-sm",
    lg: "h-12 w-12 md:h-14 md:w-14 text-base",
  };

  const badgeSizeClasses = {
    sm: "h-2 w-2 ring-1",
    md: "h-2.5 w-2.5 md:h-3 md:w-3 ring-2",
    lg: "h-3.5 w-3.5 ring-2",
  };

  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={`
          relative
          inline-flex
          items-center
          justify-center
          rounded-full
          overflow-hidden
          bg-gradient-to-br
          from-slate-800
          to-slate-900
          border
          border-slate-700/60
          shadow-inner
          ${sizeClasses[size]}
        `}
      >
        {!imageError && (user?.image || "/images/placeholder.jpg") ? (
          <Image
            alt={user?.name || "Avatar"}
            src={user?.image || "/images/placeholder.jpg"}
            fill
            sizes="48px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-semibold text-slate-300 select-none">
            {initials}
          </span>
        )}
      </div>

      {/* Real-time online / offline indicator ring */}
      <span
        aria-label={isActive ? "Online" : "Offline"}
        className={`
          absolute
          bottom-0
          right-0
          rounded-full
          ring-slate-950
          transition-colors
          duration-300
          ${badgeSizeClasses[size]}
          ${
            isActive
              ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
              : "bg-slate-500/60 ring-slate-900"
          }
        `}
      />
    </div>
  );
};

export default Avatar;
