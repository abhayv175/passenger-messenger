"use client";

import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import { Fragment, useMemo, useState } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { IoClose, IoTrash } from "react-icons/io5";
import Avatar from "@/app/components/Avatar";
import ConfirmModal from "./ConfirmModal";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";
import { formatDateOnly } from "@/app/libs/date";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const otherUser = useOtherUser(data);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email || "") !== -1;

  const joinedDate = useMemo(() => {
    return formatDateOnly(otherUser?.createdAt);
  }, [otherUser?.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser.name || "Conversation";
  }, [data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members enrolled`;
    }
    return isActive ? "Active right now" : "Offline";
  }, [data, isActive]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-auto backdrop-blur-2xl bg-slate-900/95 border-l border-slate-800/80 py-6 shadow-2xl">
                      {/* Close button */}
                      <div className="px-4 sm:px-6 flex justify-end">
                        <button
                          onClick={onClose}
                          type="button"
                          className="rounded-xl p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition focus:outline-none"
                        >
                          <span className="sr-only">Close panel</span>
                          <IoClose size={22} />
                        </button>
                      </div>

                      {/* Profile details */}
                      <div className="relative mt-2 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="mb-4">
                            {data.isGroup ? (
                              <AvatarGroup users={data.users} />
                            ) : (
                              <Avatar user={otherUser} size="lg" />
                            )}
                          </div>

                          <h3 className="text-xl font-bold text-slate-100">
                            {title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            {statusText}
                          </p>

                          {/* Quick Danger Action: Delete Conversation */}
                          <div className="my-6">
                            <button
                              onClick={() => setConfirmOpen(true)}
                              className="
                                flex
                                items-center
                                gap-2
                                px-4
                                py-2.5
                                rounded-xl
                                bg-rose-500/10
                                hover:bg-rose-500/20
                                border
                                border-rose-500/20
                                hover:border-rose-500/30
                                text-rose-400
                                text-xs
                                font-semibold
                                transition-all
                                duration-200
                                cursor-pointer
                              "
                            >
                              <IoTrash size={16} />
                              <span>Delete Dialogue</span>
                            </button>
                          </div>

                          {/* Info list */}
                          <div className="w-full text-left space-y-4 pt-4 border-t border-slate-800/80">
                            {data.isGroup && (
                              <div className="rounded-xl p-3.5 bg-slate-950/60 border border-slate-800">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                  Participants ({data.users.length})
                                </span>
                                <div className="mt-2 space-y-1.5">
                                  {data.users.map((u) => (
                                    <div
                                      key={u.id}
                                      className="flex items-center gap-2 text-sm text-slate-200"
                                    >
                                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                      <span className="font-medium">{u.name}</span>
                                      <span className="text-xs text-slate-400">
                                        ({u.email})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {!data.isGroup && otherUser.email && (
                              <div className="rounded-xl p-3.5 bg-slate-950/60 border border-slate-800">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                  Email Contact
                                </span>
                                <p className="mt-1 text-sm font-medium text-slate-200">
                                  {otherUser.email}
                                </p>
                              </div>
                            )}

                            {!data.isGroup && joinedDate && (
                              <div className="rounded-xl p-3.5 bg-slate-950/60 border border-slate-800">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                  Member Since
                                </span>
                                <p className="mt-1 text-sm font-medium text-slate-200">
                                  {joinedDate}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProfileDrawer;
