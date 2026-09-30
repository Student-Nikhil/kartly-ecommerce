import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Field from '../components/Field';
import { clearCart, placeOrder } from '../store/actions';
import { money, totals } from '../utils/format';

export const validateCheckout = (f) => {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Enter the full name for delivery.';
  if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = 'Enter a 10-digit mobile number.';
  if (f.address.trim().length < 8) e.address = 'Enter your full address (house, street, area).';
  if (f.city.trim().length < 2) e.city = 'Enter your city.';
  if (!/^\d{6}$/.test(f.pin)) e.pin = 'Enter a 6-digit PIN code.';
  if (f.method === 'upi' && !/^[\w.-]{2,}@[a-z]{2,}$/i.test(f.upi.trim())) e.upi = 'Enter a valid UPI ID, like name@okbank.';
  if (f.method === 'card') {
    if (!/^\d{16}$/.test(f.card.replace(/\s/g, ''))) e.card = 'Enter the 16-digit card number.';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.exp)) e.exp = 'Use MM/YY.';
    if (!/^\d{3}$/.test(f.cvv)) e.cvv = 'Enter the 3-digit CVV.';
  }
  return e;
};

const METHODS = [['cod', 'Cash on delivery'], ['upi', 'UPI'], ['card', 'Credit / debit card']];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.user);
  const items = useSelector((s) => s.cart.items);
  const placed = useRef(false);
  const { subtotal, shipping, total } = totals(items);
  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '', city: '', pin: '', method: 'cod', upi: '', card: '', exp: '', cvv: '' });
  const [errors, setErrors] = useState({});

  if (!user) return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  if (!items.length && !placed.current) return <Navigate to="/cart" replace />;

  const set = (k) => (e) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (errors[k]) setErrors((p) => ({ ...p, [k]: validateCheckout(next)[k] }));
  };

  const submit = (e) => {
    e.preventDefault();
    const found = validateCheckout(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    const order = {
      id: `KRT${Date.now().toString().slice(-7)}`,
      date: new Date().toISOString(),
      items, subtotal, shipping, total,
      method: METHODS.find(([k]) => k === form.method)[1],
      address: { name: form.name, phone: form.phone, line: form.address, city: form.city, pin: form.pin },
    };
    placed.current = true;
    dispatch(placeOrder(order));
    navigate(`/order/${order.id}`, { replace: true });
    dispatch(clearCart());
  };

  return (
    <div className="container-x pb-4 pt-24">
      <h1 className="mb-6 font-display text-3xl font-extrabold">Checkout</h1>
      <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="card p-5 sm:p-6">
            <h2 className="mb-4 font-display text-xl font-bold">Delivery address</h2>
            <div className="grid gap-x-4 sm:grid-cols-2">
              <Field id="name" label="Full name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
              <Field id="phone" label="Mobile number" inputMode="numeric" maxLength={10} autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
              <Field id="address" label="Address" className="sm:col-span-2" autoComplete="street-address" value={form.address} onChange={set('address')} error={errors.address} />
              <Field id="city" label="City" autoComplete="address-level2" value={form.city} onChange={set('city')} error={errors.city} />
              <Field id="pin" label="PIN code" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={form.pin} onChange={set('pin')} error={errors.pin} />
            </div>
          </section>

          <section className="card p-5 sm:p-6">
            <h2 className="mb-4 font-display text-xl font-bold">Payment method</h2>
            <div className="mb-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Payment method">
              {METHODS.map(([k, label]) => (
                <label key={k} className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition ${form.method === k ? 'border-brand bg-brand text-white dark:border-brand-light dark:bg-brand-light dark:text-ink-900' : 'border-slate-300 hover:border-brand dark:border-ink-600'}`}>
                  <input type="radio" name="method" value={k} checked={form.method === k} onChange={set('method')} className="sr-only" />{label}
                </label>
              ))}
            </div>
            {form.method === 'cod' && <p className="text-sm text-slate-600 dark:text-slate-400">Pay in cash when your order arrives.</p>}
            {form.method === 'upi' && <Field id="upi" label="UPI ID" placeholder="name@okbank" value={form.upi} onChange={set('upi')} error={errors.upi} />}
            {form.method === 'card' && (
              <div className="grid gap-x-4 sm:grid-cols-2">
                <Field id="card" label="Card number" inputMode="numeric" maxLength={19} className="sm:col-span-2" value={form.card} onChange={set('card')} error={errors.card} />
                <Field id="exp" label="Expiry (MM/YY)" maxLength={5} placeholder="08/29" value={form.exp} onChange={set('exp')} error={errors.exp} />
                <Field id="cvv" label="CVV" type="password" inputMode="numeric" maxLength={3} value={form.cvv} onChange={set('cvv')} error={errors.cvv} />
              </div>
            )}
            <p className="mt-2 text-xs text-slate-500">This is a demo store. No real payment is taken and card details are not saved.</p>
          </section>
        </div>

        <aside className="card h-fit space-y-3 p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold">Order summary</h2>
          <ul className="max-h-56 space-y-2 overflow-y-auto pr-1 text-sm">
            {items.map((i) => <li key={i.id} className="flex justify-between gap-3"><span className="line-clamp-1">{i.title} × {i.qty}</span><span className="shrink-0">{money(i.price * i.qty)}</span></li>)}
          </ul>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-sm dark:border-ink-700"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping ? money(shipping) : 'Free'}</span></div>
          <div className="flex justify-between border-t border-slate-200 pt-3 font-display text-xl font-bold dark:border-ink-700"><span>Total</span><span>{money(total)}</span></div>
          <button type="submit" className="btn btn-primary w-full">Place order</button>
          <Link to="/cart" className="block text-center text-sm font-medium text-brand hover:underline dark:text-brand-light">Back to cart</Link>
        </aside>
      </form>
    </div>
  );
}
