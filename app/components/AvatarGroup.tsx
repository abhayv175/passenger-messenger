"use client";

import { User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

interface AvatarGroupProps {
  users?: User[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }) => {
  const slicedUsers = users.slice(0, 3);
  const [errorMap, setErrorMap] = useState<Record<string, boolean>>({});

  const positionMap = {
    0: "top-0 left-[10px]",
    1: "bottom-0 left-0",
    2: "bottom-0 right-0",
  };

  return (
    <div className="relative h-10 w-10 md:h-11 md:w-11 shrink-0">
      {slicedUsers.map((user, index) => {
        const hasError = errorMap[user.id];
        const initials = (user.name || "U")[0]?.toUpperCase() || "U";

        return (
          <div
            key={user.id}
            className={`
              absolute
              inline-flex
              items-center
              justify-center
              rounded-full
              overflow-hidden
              h-[22px]
              w-[22px]
              bg-slate-800
              border-[1.5px]
              border-slate-900
              shadow-sm
              ${positionMap[index as keyof typeof positionMap]}
            `}
          >
            {!hasError ? (
              <Image
                alt={user.name || "Avatar"}
                fill
                sizes="24px"
                className="object-cover"
                src={user.image || "/images/placeholder.jpg"}
                onError={() => setErrorMap((prev) => ({ ...prev, [user.id]: true }))}
              />
            ) : (
              <span className="text-[10px] font-bold text-slate-300">
                {initials}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AvatarGroup;
