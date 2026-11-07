'use client';

import { useState } from "react";
import { User } from "@prisma/client";
import { BsChatQuoteFill } from "react-icons/bs";

import useRoutes from "@/app/hooks/useRoutes";
import Avatar from "../Avatar";
import DesktopItem from "./DesktopItem";
import SettingsModal from "./SettingsModal";

interface DesktopSidebarProps {
  currentUser: User;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div
        className="
          hidden
          lg:fixed
          lg:inset-y-0
          lg:left-0
          lg:z-40
          lg:w-20
          lg:flex
          lg:flex-col
          justify-between
          items-center
          py-5
          backdrop-blur-xl
          bg-slate-900/80
          border-r
          border-slate-800/70
          shadow-2xl
        "
      >
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Logo Brand Mark */}
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <BsChatQuoteFill size={20} className="text-white transform -scale-x-100" />
          </div>

          {/* Navigation Links */}
          <nav className="w-full px-3">
            <ul role="list" className="flex flex-col items-center space-y-2">
              {routes.map((item) => (
                <DesktopItem
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={item.active}
                  onClick={item.onClick}
                />
              ))}
            </ul>
          </nav>
        </div>

        {/* User Profile Avatar at bottom */}
        <nav className="flex flex-col items-center">
          <button
            onClick={() => setIsOpen(true)}
            title="Settings & Profile"
            className="
              relative
              p-1
              rounded-full
              transition-all
              duration-200
              hover:ring-2
              hover:ring-indigo-500/60
              hover:scale-105
              cursor-pointer
              focus:outline-none
            "
          >
            <Avatar user={currentUser} size="md" />
          </button>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
