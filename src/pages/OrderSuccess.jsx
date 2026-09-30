import { Link, Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiCheck } from 'react-icons/fi';
import { deliveryDate, money } from '../utils/format';

export default function OrderSuccess() {
  const { id } = useParams();
  const order = useSelector((s) => s.orders.items.find((o) => o.id === id));
  if (!order) return <Navigate to="/" replace />;
  const a = order.address;

  return (
    <div className="container-x max-w-2xl pb-4 pt-28 text-center">
      <span className="mx-auto grid h-20 w-20 animate-pop place-items-center rounded-full bg-brand text-4xl text-white dark:bg-brand-light dark:text-ink-900"><FiCheck /></span>
      <h1 className="mt-5 font-display text-3xl font-extrabold sm:text-4xl">Thank you, order placed!</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Order <b>{order.id}</b> will arrive by <b>{deliveryDate(4)}</b>.</p>

      <div className="card mt-8 space-y-4 p-5 text-left sm:p-6">
        <ul className="space-y-3">
          {order.items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 text-sm">
              <img src={i.image} alt="" className="h-14 w-14 shrink-0 rounded-lg bg-white object-contain p-1" />
              <span className="flex-1">{i.title} × {i.qty}</span><span className="font-bold">{money(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-slate-200 pt-3 font-display text-lg font-bold dark:border-ink-700"><span>Total paid ({order.method})</span><span>{money(order.total)}</span></div>
        <p className="text-sm text-slate-600 dark:text-slate-400">Delivering to {a.name}, {a.line}, {a.city} {a.pin} · {a.phone}</p>
      </div>
      <Link to="/" className="btn btn-primary mt-8">Continue shopping</Link>
    </div>
  );
}
