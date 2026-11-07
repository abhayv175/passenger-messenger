import { BsChatSquareHeart, BsShieldLock, BsLightningCharge } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";

const EmptyState = () => {
  return (
    <div
      className="
        px-6
        py-12
        h-full
        flex
        flex-col
        justify-center
        items-center
        bg-gradient-to-b
        from-slate-950
        via-slate-900
        to-slate-950
        text-slate-100
        relative
        overflow-hidden
      "
    >
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="relative z-10 text-center items-center flex flex-col max-w-md">
        <div className="relative mb-6">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-500/25 ring-1 ring-white/20">
            <BsChatSquareHeart size={36} className="text-white" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-slate-950"></span>
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-4">
          <HiSparkles size={14} className="text-indigo-400" />
          <span>Passenger Messenger</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
          Ready for departure
        </h3>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-sm">
          Select an existing dialogue from the sidebar or initiate a new peer or group broadcast to begin communicating.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-xs text-left">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <BsLightningCharge size={14} />
              <span className="text-xs font-semibold text-slate-200">Real-Time</span>
            </div>
            <p className="text-[11px] text-slate-500">Instant Pusher socket delivery</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <BsShieldLock size={14} />
              <span className="text-xs font-semibold text-slate-200">Secure</span>
            </div>
            <p className="text-[11px] text-slate-500">NextAuth session guarded</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
