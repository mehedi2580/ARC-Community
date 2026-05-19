export function PostSkeleton() {
  return (
    <div className="feed-item px-4 py-4 animate-pulse">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <div className="h-3.5 w-28 skeleton" />
            <div className="h-3.5 w-16 skeleton" />
          </div>
          <div className="h-3 w-20 skeleton" />
          <div className="space-y-1.5 mt-2">
            <div className="h-3.5 w-full skeleton" />
            <div className="h-3.5 w-4/5 skeleton" />
            <div className="h-3.5 w-3/5 skeleton" />
          </div>
          <div className="flex gap-4 mt-3">
            <div className="h-6 w-12 skeleton" />
            <div className="h-6 w-12 skeleton" />
            <div className="h-6 w-12 skeleton" />
            <div className="h-6 w-12 skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-white/[0.07] bg-surface animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full skeleton" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-28 skeleton" />
          <div className="h-3 w-20 skeleton" />
        </div>
      </div>
      <div className="h-3.5 w-full skeleton" />
      <div className="h-3.5 w-3/4 skeleton" />
    </div>
  );
}

export function ChannelSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-white/[0.07] bg-surface animate-pulse flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl skeleton" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 w-24 skeleton" />
        <div className="h-3 w-32 skeleton" />
      </div>
      <div className="h-7 w-16 skeleton rounded-lg" />
    </div>
  );
}
