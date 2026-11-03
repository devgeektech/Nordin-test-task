export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mb-4 flex gap-3">
        <div className="h-10 flex-1 animate-pulse rounded-md bg-slate-200" />
        <div className="h-10 w-40 animate-pulse rounded-md bg-slate-200" />
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="h-12 border-b border-slate-100 bg-slate-50/80 last:border-b-0"
          />
        ))}
      </div>
    </div>
  );
}
