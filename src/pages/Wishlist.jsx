import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';

export default function Wishlist() {
  const items = useSelector((s) => s.wishlist.items);
  if (!items.length) {
    return (
      <div className="container-x pt-36 text-center">
        <p className="text-6xl" aria-hidden="true">💛</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold">Your wishlist is empty</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Tap the heart on any product to save it for later.</p>
        <Link to="/#shop" className="btn btn-primary mt-6">Browse products</Link>
      </div>
    );
  }
  return (
    <div className="container-x pb-4 pt-24">
      <h1 className="mb-6 font-display text-3xl font-extrabold">Wishlist <span className="text-lg font-medium text-slate-500">({items.length})</span></h1>
      <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((p, n) => <Reveal key={p.id} delay={(n % 4) * 80}><ProductCard product={p} /></Reveal>)}
      </div>
    </div>
  );
}
