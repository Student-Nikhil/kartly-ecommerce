import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart } from 'react-icons/fi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Stars from './Stars';
import { addToCart, toggleWishlist } from '../store/actions';
import { discountFor, money, originalPrice, titleCase } from '../utils/format';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const inCart = useSelector((s) => s.cart.items.some((i) => i.id === product.id));
  const liked = useSelector((s) => s.wishlist.items.some((i) => i.id === product.id));

  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/10 dark:hover:border-brand-light/50">
      <span className="absolute left-3 top-3 z-10 rounded-full bg-saffron px-2.5 py-1 text-xs font-bold text-ink-900">{discountFor(product.id)}% off</span>
      <button onClick={() => dispatch(toggleWishlist(product))} aria-pressed={liked} aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg text-rose-500 shadow transition hover:scale-110 active:scale-90 dark:bg-ink-700/90">
        <span key={String(liked)} className="animate-pop">{liked ? <FaHeart /> : <FaRegHeart />}</span>
      </button>

      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-white p-6">
        <img src={product.image} alt={product.title} loading="lazy" className="h-full w-full object-contain transition duration-500 group-hover:scale-110" />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium text-brand dark:text-brand-light">{titleCase(product.category)}</p>
        <Link to={`/product/${product.id}`} className="line-clamp-2 min-h-[2.75rem] text-sm font-bold leading-snug hover:text-brand dark:hover:text-brand-light">{product.title}</Link>
        <Stars rate={product.rating?.rate} count={product.rating?.count} />
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-display text-xl font-bold">{money(product.price)}</span>
          <span className="text-sm text-slate-400 line-through">{money(originalPrice(product.price, product.id))}</span>
        </div>
        {inCart ? (
          <Link to="/cart" className="btn btn-accent w-full"><FiShoppingCart /> Go to cart</Link>
        ) : (
          <button onClick={() => dispatch(addToCart(product))} className="btn btn-primary w-full"><FiShoppingCart /> Add to cart</button>
        )}
      </div>
    </article>
  );
}
