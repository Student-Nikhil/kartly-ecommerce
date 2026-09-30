import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import Logo from './Logo';
import Modal from './Modal';
import { validEmail } from '../utils/format';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [modal, setModal] = useState(null);

  const subscribe = (e) => {
    e.preventDefault();
    if (!validEmail(email)) return setMsg({ type: 'error', text: 'Enter a valid email, like name@example.com.' });
    setMsg({ type: 'ok', text: 'You are subscribed. Watch your inbox for deals.' });
    setEmail('');
  };
  const link = 'text-slate-600 transition hover:text-brand dark:text-slate-400 dark:hover:text-brand-light';

  return (
    <footer className="mt-24 border-t border-slate-200 bg-white dark:border-ink-700 dark:bg-ink-800">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-slate-600 dark:text-slate-400">Kartly is a small online store for everyday essentials: electronics, jewellery and clothing, delivered quickly with easy returns.</p>
        </div>
        <nav aria-label="Quick links">
          <h3 className="mb-3 font-display font-bold">Quick links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className={link} to="/">Home</Link></li>
            <li><Link className={link} to="/#shop">Shop</Link></li>
            <li><Link className={link} to="/wishlist">Wishlist</Link></li>
            <li><Link className={link} to="/cart">Cart</Link></li>
            <li><button className={link} onClick={() => setModal('privacy')}>Privacy policy</button></li>
            <li><button className={link} onClick={() => setModal('terms')}>Terms &amp; conditions</button></li>
          </ul>
        </nav>
        <div>
          <h3 className="mb-3 font-display font-bold">Contact us</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-2"><FiPhone className="mt-0.5 shrink-0" /> +91 98765 43210</li>
            <li className="flex gap-2"><FiMail className="mt-0.5 shrink-0" /> support@kartly.example</li>
            <li className="flex gap-2"><FiMapPin className="mt-0.5 shrink-0" /> Bhiwandi, Maharashtra, India</li>
          </ul>
        </div>
        <form onSubmit={subscribe} noValidate>
          <h3 className="mb-3 font-display font-bold">Get deals in your inbox</h3>
          <label htmlFor="news-email" className="sr-only">Email address</label>
          <div className="flex gap-2">
            <input id="news-email" className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={msg.type === 'error'} />
            <button className="btn btn-primary" type="submit">Subscribe</button>
          </div>
          {msg.text && <p role="status" className={`mt-2 text-sm ${msg.type === 'error' ? 'text-red-500' : 'text-brand dark:text-brand-light'}`}>{msg.text}</p>}
        </form>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-ink-700">© {new Date().getFullYear()} Kartly. Product data from Fake Store API.</div>

      {modal === 'privacy' && (
        <Modal title="Privacy policy" onClose={() => setModal(null)}>
          <p>We store your cart, wishlist, theme and login name only in your browser, using local storage. Nothing is sent to our servers.</p>
          <p>Your email is used only to send the newsletter you subscribe to, and you can unsubscribe at any time.</p>
        </Modal>
      )}
      {modal === 'terms' && (
        <Modal title="Terms & conditions" onClose={() => setModal(null)}>
          <p>Kartly is a demo store built for learning. Products, prices and offers are sample data and cannot be purchased.</p>
          <p>By using this site you agree not to misuse it. Returns are free within 30 days in this demo scenario.</p>
        </Modal>
      )}
    </footer>
  );
}
