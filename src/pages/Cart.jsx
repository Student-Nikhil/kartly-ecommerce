import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { clearCart, removeFromCart, setQty } from '../store/actions';
import { money, totals } from '../utils/format';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const { subtotal, shipping, total } = totals(items);

  if (!items.length) {
    return (
      <div className="container-x pt-36 text-center">
        <p className="text-6xl" aria-hidden="true">🛒</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Add something you like and it will show up here.</p>
        <Link to="/#shop" className="btn btn-primary mt-6">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-x pb-4 pt-24">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold">Your cart <span className="text-lg font-medium text-slate-500">({items.length})</span></h1>
        <button className="text-sm font-medium text-red-500 hover:underline" onClick={() => dispatch(clearCart())}>Clear cart</button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-4">
          {items.map((i) => (
            <li key={i.id} className="card flex animate-slideIn gap-4 p-3 sm:p-4">
              <Link to={`/product/${i.id}`} className="grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-white p-2 sm:h-28 sm:w-28"><img src={i.image} alt={i.title} className="max-h-full object-contain" /></Link>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Link to={`/product/${i.id}`} className="line-clamp-2 text-sm font-bold hover:text-brand dark:hover:text-brand-light sm:text-base">{i.title}</Link>
                <p className="font-display text-lg font-bold">{money(i.price)}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-slate-300 dark:border-ink-600">
                    <button className="icon-btn !h-9 !w-9" aria-label="Decrease quantity" disabled={i.qty <= 1} onClick={() => dispatch(setQty(i.id, i.qty - 1))}><FiMinus /></button>
                    <span className="w-8 text-center text-sm font-bold" aria-live="polite">{i.qty}</span>
                    <button className="icon-btn !h-9 !w-9" aria-label="Increase quantity" onClick={() => dispatch(setQty(i.id, i.qty + 1))}><FiPlus /></button>
                  </div>
                  <button className="flex items-center gap-1 text-sm text-red-500 hover:underline" onClick={() => dispatch(removeFromCart(i.id))}><FiTrash2 /> Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="card h-fit space-y-3 p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping ? money(shipping) : 'Free'}</span></div>
          <div className="flex justify-between border-t border-slate-200 pt-3 font-display text-xl font-bold dark:border-ink-700"><span>Total</span><span data-testid="cart-total">{money(total)}</span></div>
          <Link to="/checkout" className="btn btn-primary w-full">Proceed to checkout</Link>
          <Link to="/#shop" className="block text-center text-sm font-medium text-brand hover:underline dark:text-brand-light">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
