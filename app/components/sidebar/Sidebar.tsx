import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";
import getCurrentUser from "@/app/actions/getCurrentUser";

async function Sidebar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full bg-slate-950 text-slate-100 flex flex-col lg:flex-row overflow-hidden">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full flex-1 w-full overflow-hidden">
        {children}
      </main>
    </div>
  );
}

export default Sidebar;
