"use client";

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConversation();

  if (isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        justify-around
        w-full
        bottom-0
        z-40
        flex
        items-center
        backdrop-blur-xl
        bg-slate-900/90
        border-t
        border-slate-800/80
        py-2
        px-4
        lg:hidden
        shadow-2xl
      "
    >
      {routes.map((route) => (
        <MobileItem
          key={route.href}
          href={route.href}
          label={route.label}
          active={route.active}
          icon={route.icon}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
};

export default MobileFooter;
