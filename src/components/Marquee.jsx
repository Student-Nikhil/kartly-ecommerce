const WORDS = ['Free returns', 'New arrivals', 'Up to 30% off', 'Free shipping over $50', 'Secure payments', '24/7 support'];

export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden border-y border-slate-200 bg-saffron py-3 text-ink-900 dark:border-ink-700" aria-hidden="true">
      <div className="flex w-max animate-marquee gap-10 font-display text-lg font-bold">
        {row.map((w, n) => <span key={n} className="flex items-center gap-10 whitespace-nowrap">{w}<span className="h-2 w-2 rotate-45 bg-ink-900" /></span>)}
      </div>
    </div>
  );
}
