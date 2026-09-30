import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SLIDES = [
  { title: 'Tech that keeps up with you', text: 'Drives, monitors and gear at prices that make upgrading easy.', cats: ['electronics', 'smartphones', 'laptops'], cta: 'Shop electronics' },
  { title: 'Wear it. Gift it. Keep it.', text: 'Rings, chains and pendants with up to 30% off this week.', cats: ['jewelery', 'sunglasses', 'fragrances'], cta: 'Shop jewellery' },
  { title: 'Fresh fits for every day', text: 'Jackets, tees and layers for men and women, all in one place.', cats: ["men's clothing", 'mens-shirts', 'womens-dresses'], cta: 'Shop clothing' },
];

export default function Banner() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const root = useRef(null);
  const items = useSelector((s) => s.products.items);
  const go = (n) => setI((n + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, [paused]);

  // Parallax: expose scroll position as a CSS variable used by the decorative shapes
  useEffect(() => {
    const el = root.current;
    const onScroll = () => el && el.style.setProperty('--sy', `${Math.min(window.scrollY, 700)}`);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const slide = SLIDES[i];
  const shot = (items.find((p) => slide.cats.includes(p.category)) || items[i * 3])?.image;

  return (
    <section ref={root} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label="Featured offers"
      className="relative isolate overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-teal-500 pt-16 text-white dark:from-ink-800 dark:via-[#0b3b39] dark:to-brand-dark">
      {/* parallax decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-24" style={{ transform: 'translateY(calc(var(--sy,0) * 0.25px))' }}>
          <div className="h-64 w-64 animate-float-slow rounded-full bg-saffron/25 blur-2xl" />
        </div>
        <div className="absolute -right-16 bottom-0" style={{ transform: 'translateY(calc(var(--sy,0) * -0.2px))' }}>
          <div className="h-80 w-80 animate-float rounded-[40%_60%_60%_40%] bg-white/10 blur-xl" />
        </div>
        <div className="absolute right-1/3 top-28 hidden h-6 w-6 animate-float rounded-full border-4 border-saffron sm:block" style={{ transform: 'translateY(calc(var(--sy,0) * 0.4px))' }} />
        <div className="absolute bottom-16 left-1/3 hidden h-5 w-5 rotate-45 animate-float-slow bg-white/40 sm:block" />
      </div>

      <div className="container-x grid min-h-[30rem] items-center gap-8 py-12 md:grid-cols-2 lg:min-h-[34rem]">
        <div key={i} className="animate-slideIn">
          <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">Free shipping over $50</p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">{slide.title}</h1>
          <p className="mt-4 max-w-md text-base text-white/85 sm:text-lg">{slide.text}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#shop" className="btn btn-accent">{slide.cta}</a>
            <Link to="/wishlist" className="btn border border-white/40 hover:bg-white/10">View wishlist</Link>
          </div>
        </div>

        <div className="relative mx-auto hidden h-72 w-72 md:block lg:h-96 lg:w-96" style={{ transform: 'translateY(calc(var(--sy,0) * -0.08px))' }}>
          <div className="absolute inset-0 rotate-6 rounded-[2.5rem] bg-saffron/90" aria-hidden="true" />
          <div className="absolute inset-0 grid -rotate-3 place-items-center overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-2xl transition-transform duration-500 hover:rotate-0">
            {shot ? <img key={shot} src={shot} alt="" className="max-h-full animate-slideIn object-contain" /> : <div className="skeleton h-full w-full rounded-3xl bg-slate-200" />}
          </div>
        </div>
      </div>

      <div className="container-x flex items-center justify-between pb-6">
        <div className="flex gap-2" role="tablist" aria-label="Choose slide">
          {SLIDES.map((s, n) => (
            <button key={s.title} role="tab" aria-selected={n === i} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)}
              className={`h-2.5 rounded-full transition-all duration-300 ${n === i ? 'w-8 bg-saffron' : 'w-2.5 bg-white/50 hover:bg-white'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button className="icon-btn border border-white/30 hover:!bg-white/15" onClick={() => go(i - 1)} aria-label="Previous slide"><FiChevronLeft /></button>
          <button className="icon-btn border border-white/30 hover:!bg-white/15" onClick={() => go(i + 1)} aria-label="Next slide"><FiChevronRight /></button>
        </div>
      </div>
    </section>
  );
}
