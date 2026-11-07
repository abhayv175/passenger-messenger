"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { User } from "@prisma/client";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";
import UserBox from "./UserBox";

interface UserListProps {
  items: User[];
}

const UserList: React.FC<UserListProps> = ({ items }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  return (
    <aside
      className="
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
        block
        w-full
        left-0
        transition-all
        duration-200
      "
    >
      <div className="px-4 py-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              People
            </h1>
            {items.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                {items.length}
              </span>
            )}
          </div>
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
            placeholder="Search contacts..."
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

        {/* Users List */}
        <div className="flex flex-col gap-1.5 mt-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm text-slate-400">
                {searchQuery ? "No contacts found" : "No other users registered yet"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {searchQuery ? "Try a different name or email" : "Invite teammates to join"}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => <UserBox key={item.id} data={item} />)
          )}
        </div>
      </div>
    </aside>
  );
};

export default UserList;
