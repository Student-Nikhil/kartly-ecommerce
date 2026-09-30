import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheck, FiChevronLeft, FiCreditCard, FiShoppingCart, FiTag, FiTruck } from 'react-icons/fi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import Stars from '../components/Stars';
import { addToCart, fetchProduct, toggleWishlist } from '../store/actions';
import { deliveryDate, discountFor, money, originalPrice, titleCase } from '../utils/format';

const PAYMENTS = ['Credit / Debit card', 'UPI', 'Net banking', 'Cash on delivery'];
const OFFERS = ['5% cashback on Kartly card', 'No-cost EMI on orders above $100', 'Extra 10% off on your first order'];

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: p, currentStatus } = useSelector((s) => s.products);
  const inCart = useSelector((s) => s.cart.items.some((i) => i.id === Number(id)));
  const liked = useSelector((s) => s.wishlist.items.some((i) => i.id === Number(id)));

  useEffect(() => { dispatch(fetchProduct(id)); }, [dispatch, id]);

  if (currentStatus === 'error') {
    return <div className="container-x pt-32 text-center"><p className="font-bold">We couldn’t find that product.</p><Link className="btn btn-primary mt-4" to="/">Back to shop</Link></div>;
  }
  if (!p || currentStatus === 'loading') {
    return (
      <div className="container-x grid gap-8 pt-28 md:grid-cols-2" aria-busy="true">
        <div className="skeleton aspect-square rounded-3xl bg-slate-200 dark:bg-ink-700" />
        <div className="space-y-4">{[60, 100, 40, 90, 30].map((w) => <div key={w} className="skeleton h-6 rounded bg-slate-200 dark:bg-ink-700" style={{ width: `${w}%` }} />)}</div>
      </div>
    );
  }

  const features = p.description.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 5);

  return (
    <div className="container-x animate-slideIn pb-4 pt-24">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand dark:text-slate-400 dark:hover:text-brand-light"><FiChevronLeft /> Back to shop</Link>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="card grid aspect-square place-items-center overflow-hidden !bg-white p-8 sm:p-12 lg:sticky lg:top-24 lg:self-start">
          <img src={p.image} alt={p.title} className="max-h-full object-contain transition duration-500 hover:scale-105" />
        </div>

        <div className="space-y-5">
          <p className="text-sm font-bold text-brand dark:text-brand-light">{titleCase(p.category)}</p>
          <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-4xl">{p.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <Stars rate={p.rating.rate} size={18} />
            <span className="text-sm text-slate-500">{p.rating.rate} · {p.rating.count} reviews</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold">{money(p.price)}</span>
            <span className="text-lg text-slate-400 line-through">{money(originalPrice(p.price, p.id))}</span>
            <span className="rounded-full bg-saffron px-3 py-1 text-sm font-bold text-ink-900">{discountFor(p.id)}% off</span>
          </div>
          <p className="text-sm font-medium text-brand dark:text-brand-light">{p.rating.count} units in stock</p>

          <div className="flex flex-wrap gap-3">
            {inCart ? <Link to="/cart" className="btn btn-accent flex-1 sm:flex-none"><FiShoppingCart /> Go to cart</Link>
              : <button className="btn btn-primary flex-1 sm:flex-none" onClick={() => dispatch(addToCart(p))}><FiShoppingCart /> Add to cart</button>}
            <button className="btn btn-ghost" aria-pressed={liked} onClick={() => dispatch(toggleWishlist(p))}>
              {liked ? <FaHeart className="text-rose-500" /> : <FaRegHeart />} {liked ? 'Saved' : 'Save for later'}
            </button>
          </div>

          <div className="card space-y-3 p-4 text-sm">
            <p className="flex items-center gap-2"><FiTruck className="text-brand dark:text-brand-light" /> Delivery by <b>{deliveryDate(4)}</b> · Free over $50</p>
            <div>
              <p className="mb-2 flex items-center gap-2 font-bold"><FiCreditCard className="text-brand dark:text-brand-light" /> Payment options</p>
              <div className="flex flex-wrap gap-2">{PAYMENTS.map((x) => <span key={x} className="rounded-full border border-slate-300 px-3 py-1 dark:border-ink-600">{x}</span>)}</div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-2 font-bold"><FiTag className="text-brand dark:text-brand-light" /> Offers</p>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400">{OFFERS.map((x) => <li key={x}>• {x}</li>)}</ul>
            </div>
          </div>

          <div>
            <h2 className="mb-2 font-display text-lg font-bold">About this product</h2>
            <p className="leading-relaxed text-slate-600 dark:text-slate-300">{p.description}</p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-lg font-bold">Key features</h2>
            <ul className="space-y-2">{features.map((f) => <li key={f} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300"><FiCheck className="mt-0.5 shrink-0 text-brand dark:text-brand-light" />{f}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
