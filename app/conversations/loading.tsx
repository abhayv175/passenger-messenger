const ConversationSkeleton = () => {
  return (
    <div
      className="
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-84
        xl:w-96
        block
        w-full
        left-0
        backdrop-blur-xl
        bg-slate-900/70
        border-r
        border-slate-800/70
        overflow-y-auto
        z-30
        p-4
      "
    >
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-4 pt-1 animate-pulse">
        <div className="h-7 w-28 bg-slate-800/80 rounded-lg" />
        <div className="h-8 w-8 bg-slate-800/80 rounded-xl" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-10 w-full bg-slate-800/60 rounded-xl mb-4 animate-pulse" />

      {/* Item Skeletons */}
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40 animate-pulse"
          >
            {/* Avatar circle */}
            <div className="h-10 w-10 rounded-full bg-slate-800/80 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <div className="h-3.5 bg-slate-800/80 rounded w-1/3" />
                <div className="h-3 bg-slate-800/60 rounded w-10" />
              </div>
              <div className="h-3 bg-slate-850 bg-slate-800/50 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationSkeleton;
