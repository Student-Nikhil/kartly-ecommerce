import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiBell, FiHeart, FiSearch, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { logout, setSearch } from '../store/actions';

const NOTES = [
  { id: 1, t: 'Free shipping on orders over $50', d: 'Today' },
  { id: 2, t: 'New arrivals in Electronics', d: 'Yesterday' },
  { id: 3, t: 'Wishlist items are on sale — check them out', d: '2 days ago' },
];

const Badge = ({ n }) => n > 0 && (
  <span key={n} className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-saffron px-1 text-[11px] font-bold text-ink-900">{n}</span>
);

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const search = useSelector((s) => s.products.search);
  const cartCount = useSelector((s) => s.cart.items.reduce((n, i) => n + i.qty, 0));
  const wishCount = useSelector((s) => s.wishlist.items.length);
  const user = useSelector((s) => s.user);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef(null);
  const notesRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);
  useEffect(() => {
    const close = (e) => notesRef.current && !notesRef.current.contains(e.target) && setNotesOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const onSearch = (v) => {
    dispatch(setSearch(v));
    if (pathname !== '/') navigate('/#shop');
  };
  const closeSearch = () => { setSearchOpen(false); dispatch(setSearch('')); };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'border-slate-200/70 bg-paper/85 shadow-sm backdrop-blur-xl dark:border-ink-700 dark:bg-ink-900/85' : 'border-transparent bg-paper/60 backdrop-blur dark:bg-ink-900/50'}`}>
      <div className="container-x flex h-16 items-center gap-2 sm:gap-3">
        <div className={searchOpen ? 'hidden sm:block' : ''}><Logo /></div>

        <div className="ml-auto flex flex-1 items-center justify-end gap-0.5 sm:gap-1.5">
          {searchOpen ? (
            <div className="flex max-w-md flex-1 animate-drop items-center gap-2 rounded-full border border-slate-300 bg-white px-4 dark:border-ink-600 dark:bg-ink-800">
              <FiSearch className="shrink-0 text-slate-400" />
              <input ref={inputRef} value={search} onChange={(e) => onSearch(e.target.value)} onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
                placeholder="Search products by name" aria-label="Search products" className="h-10 w-full bg-transparent text-sm outline-none" />
              <button onClick={closeSearch} aria-label="Close search" className="text-slate-400 hover:text-slate-700 dark:hover:text-white"><FiX /></button>
            </div>
          ) : (
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Open search"><FiSearch /></button>
          )}

          <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wishCount} items`}><FiHeart /><Badge n={wishCount} /></Link>
          <Link to="/cart" className="icon-btn" aria-label={`Cart, ${cartCount} items`}><FiShoppingCart /><Badge n={cartCount} /></Link>

          <div ref={notesRef} className="relative hidden min-[420px]:block">
            <button className="icon-btn" onClick={() => setNotesOpen((o) => !o)} aria-label="Notifications" aria-expanded={notesOpen}>
              <FiBell /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-saffron" />
            </button>
            {notesOpen && (
              <div className="card absolute right-0 mt-2 w-72 animate-drop p-2 shadow-xl">
                {NOTES.map((n) => (
                  <div key={n.id} className="rounded-xl p-3 text-sm hover:bg-slate-100 dark:hover:bg-ink-700">
                    <p className="font-medium">{n.t}</p><p className="text-xs text-slate-500">{n.d}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <ThemeToggle />

          {user ? (
            <button className="btn btn-ghost !px-3" onClick={() => dispatch(logout())} title="Log out">
              <FiUser /><span className="hidden max-w-[7rem] truncate md:inline">{user.name}</span><span className="hidden md:inline">· Log out</span>
            </button>
          ) : (
            <>
              <Link to="/signup" className="btn btn-ghost hidden md:inline-flex">Sign up</Link>
              <Link to="/login" className="btn btn-primary !px-3 sm:!px-5"><FiUser className="sm:hidden" /><span className="hidden sm:inline">Log in</span></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
