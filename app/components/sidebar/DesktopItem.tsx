'use client';

import clsx from "clsx";
import Link from "next/link";
import React from "react";

interface DesktopItemProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}) => {
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick} className="w-full flex justify-center">
      <Link
        href={href}
        title={label}
        className={clsx(
          `
          group
          relative
          flex
          items-center
          justify-center
          rounded-xl
          p-3
          transition-all
          duration-200
          ease-in-out
        `,
          active
            ? "bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20"
            : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
        )}
      >
        <Icon className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:scale-110" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;
