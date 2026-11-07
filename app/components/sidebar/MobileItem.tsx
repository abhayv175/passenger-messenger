"use client";

import Link from "next/link";
import clsx from "clsx";
import React from "react";

interface MobileItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
}

const MobileItem: React.FC<MobileItemProps> = ({
  href,
  label,
  icon: Icon,
  active,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <Link
      onClick={handleClick}
      href={href}
      className={clsx(
        `
        group
        flex
        flex-col
        items-center
        justify-center
        gap-1
        py-2
        px-4
        rounded-xl
        text-xs
        font-medium
        transition-all
        duration-200
      `,
        active
          ? "text-indigo-400 bg-indigo-500/10"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      )}
    >
      <Icon
        className={clsx(
          "h-6 w-6 transition-transform duration-200 group-hover:scale-110",
          active && "text-indigo-400"
        )}
      />
      <span>{label}</span>
    </Link>
  );
};

export default MobileItem;
