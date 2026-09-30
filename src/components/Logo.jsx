import { Link } from 'react-router-dom';

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`group flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight ${className}`} aria-label="Kartly home">
      <svg viewBox="0 0 40 40" className="h-9 w-9 transition-transform duration-300 group-hover:-rotate-12" aria-hidden="true">
        <rect width="40" height="40" rx="11" className="fill-brand dark:fill-brand-light" />
        <path d="M10 13h3l2.6 11.2a2 2 0 0 0 2 1.5h9a2 2 0 0 0 1.9-1.4L31 17H15" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-ink-900" />
        <circle cx="19" cy="30" r="1.9" className="fill-saffron" />
        <circle cx="27" cy="30" r="1.9" className="fill-saffron" />
      </svg>
      <span>Kart<span className="text-brand dark:text-brand-light">ly</span></span>
    </Link>
  );
}
