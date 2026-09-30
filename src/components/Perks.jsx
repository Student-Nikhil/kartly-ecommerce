import { FiHeadphones, FiRefreshCw, FiShield, FiTruck } from 'react-icons/fi';
import Reveal from './Reveal';

const PERKS = [
  { icon: FiTruck, title: 'Free shipping', text: 'On every order over $50.' },
  { icon: FiRefreshCw, title: 'Free returns', text: 'Changed your mind? Send it back within 30 days.' },
  { icon: FiHeadphones, title: '24/7 support', text: 'Chat or call us any time of day.' },
  { icon: FiShield, title: 'Secure payments', text: 'Cards, UPI, net banking and cash on delivery.' },
];

export default function Perks() {
  return (
    <section className="container-x -mt-8 relative z-10" aria-label="Why shop with us">
      <div className="card grid gap-2 p-3 shadow-xl sm:grid-cols-2 lg:grid-cols-4">
        {PERKS.map(({ icon: Icon, title, text }, n) => (
          <Reveal key={title} delay={n * 90}>
            <div className="group flex items-start gap-3 rounded-xl p-4 transition hover:bg-slate-100 dark:hover:bg-ink-700">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-xl text-brand transition group-hover:rotate-6 group-hover:bg-brand group-hover:text-white dark:bg-brand-light/10 dark:text-brand-light dark:group-hover:bg-brand-light dark:group-hover:text-ink-900"><Icon /></span>
              <div><h3 className="font-display font-bold">{title}</h3><p className="text-sm text-slate-600 dark:text-slate-400">{text}</p></div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
