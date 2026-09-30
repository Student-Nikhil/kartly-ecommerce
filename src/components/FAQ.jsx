import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const QA = [
  ['How long does delivery take?', 'Most orders arrive in 3–5 working days. You will see the estimated date on every product page.'],
  ['Can I return an item?', 'Yes. Returns are free within 30 days as long as the item is unused and in its original packaging.'],
  ['Which payment methods do you accept?', 'Credit and debit cards, UPI, net banking and cash on delivery.'],
  ['Will my cart be saved if I close the tab?', 'Yes. Your cart, wishlist and theme are saved in this browser until you clear them.'],
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {QA.map(([q, a], n) => {
        const isOpen = open === n;
        return (
          <div key={q} className="card overflow-hidden">
            <button className="flex w-full items-center justify-between gap-4 p-4 text-left font-bold" aria-expanded={isOpen} aria-controls={`faq-${n}`} onClick={() => setOpen(isOpen ? -1 : n)}>
              {q}<FiChevronDown className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand dark:text-brand-light' : ''}`} />
            </button>
            <div id={`faq-${n}`} className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <p className="overflow-hidden px-4 text-sm text-slate-600 dark:text-slate-400"><span className="block pb-4">{a}</span></p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
