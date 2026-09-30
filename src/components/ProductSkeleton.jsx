export default function ProductSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <div className="skeleton aspect-square bg-slate-200 dark:bg-ink-700" />
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-1/3 rounded bg-slate-200 dark:bg-ink-700" />
        <div className="skeleton h-4 w-full rounded bg-slate-200 dark:bg-ink-700" />
        <div className="skeleton h-4 w-2/3 rounded bg-slate-200 dark:bg-ink-700" />
        <div className="skeleton h-10 w-full rounded-full bg-slate-200 dark:bg-ink-700" />
      </div>
    </div>
  );
}
