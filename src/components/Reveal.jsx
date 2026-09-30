import { useEffect, useRef, useState } from 'react';

// Fades content up the first time it scrolls into view.
export default function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setSeen(true); return undefined; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`reveal ${seen ? 'in' : ''} ${className}`}>
      {children}
    </div>
  );
}
