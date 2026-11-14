import AuthForm from "./components/AuthFrom";
import { BsChatQuoteFill } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";
import getSession from "@/app/actions/getSession";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const Auth = async () => {
  const session = await getSession();

  if (session?.user?.email) {
    redirect("/conversations");
  }

  return (
    <div
      className="
        relative
        flex
        min-h-full
        flex-col
        justify-center
        py-12
        sm:px-6
        lg:px-8
        bg-slate-950
        text-slate-100
        overflow-hidden
      "
    >
      {/* Ambient background glows */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none -top-40 left-1/2 -translate-x-1/2" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none bottom-0 right-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Icon */}
        <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 items-center justify-center shadow-xl shadow-indigo-500/30 ring-1 ring-white/20 mb-4">
          <BsChatQuoteFill size={28} className="text-white transform -scale-x-100" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 mb-2">
          <HiSparkles size={13} />
          <span>PASSENGER MESSENGER</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
          Step aboard
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Fluid, contemporary real-time messaging with Next.js 14 & Pusher
        </p>
      </div>

      <div className="relative z-10">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
