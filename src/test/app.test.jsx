import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { makeStore } from '../store';
import ProductCard from '../components/ProductCard';
import Login, { validate } from '../pages/Login';
import { cart, wishlist } from '../store/reducers';
import { addToCart, toggleWishlist, setQty } from '../store/actions';
import { discountFor, originalPrice } from '../utils/format';

const product = { id: 1, title: 'Test Backpack', price: 100, image: 'x.png', category: 'electronics', rating: { rate: 4.5, count: 20 } };
const setup = (ui) => {
  const store = makeStore({ cart: { items: [] }, wishlist: { items: [] }, theme: 'light', user: null });
  return { store, ...render(<Provider store={store}><MemoryRouter>{ui}</MemoryRouter></Provider>) };
};

describe('cart reducer', () => {
  it('adds once, updates quantity and never goes below 1', () => {
    let s = cart(undefined, addToCart(product));
    s = cart(s, addToCart(product));
    expect(s.items).toHaveLength(1);
    s = cart(s, setQty(1, 0));
    expect(s.items[0].qty).toBe(1);
  });
});

describe('wishlist reducer', () => {
  it('toggles a product in and out', () => {
    let s = wishlist(undefined, toggleWishlist(product));
    expect(s.items).toHaveLength(1);
    s = wishlist(s, toggleWishlist(product));
    expect(s.items).toHaveLength(0);
  });
});

describe('pricing helpers', () => {
  it('shows an original price higher than the sale price', () => {
    expect(originalPrice(100, 1)).toBeGreaterThan(100);
    expect(discountFor(1)).toBe(15);
  });
});

describe('ProductCard', () => {
  it('switches Add to cart to Go to cart', () => {
    setup(<ProductCard product={product} />);
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.getByRole('link', { name: /go to cart/i })).toBeInTheDocument();
  });
  it('toggles the wishlist button', () => {
    setup(<ProductCard product={product} />);
    const btn = screen.getByRole('button', { name: /add to wishlist/i });
    fireEvent.click(btn);
    expect(screen.getByRole('button', { name: /remove from wishlist/i })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('Login validation', () => {
  it('rejects bad input', () => {
    expect(validate({ email: '', password: '' })).toHaveProperty('email');
    expect(validate({ email: 'a@b.com', password: 'abc' })).toHaveProperty('password');
    expect(validate({ email: 'a@b.com', password: 'abcdef' })).toHaveProperty('password');
    expect(validate({ email: 'a@b.com', password: 'abc123' })).toEqual({});
  });
  it('shows errors on submit', () => {
    setup(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /^log in$/i }));
    expect(screen.getByText(/enter your email/i)).toBeInTheDocument();
  });
});

import { validateSignup } from '../pages/Signup';
import { validateCheckout } from '../pages/Checkout';
import { register, authenticate } from '../utils/auth';
import { orders } from '../store/reducers';
import { placeOrder } from '../store/actions';

describe('sign up and login', () => {
  it('validates the sign-up form', () => {
    expect(validateSignup({ name: 'A', email: 'x', password: 'abc', confirm: 'zzz' })).toHaveProperty('confirm');
    expect(validateSignup({ name: 'Asha', email: 'a@b.com', password: 'abc123', confirm: 'abc123' })).toEqual({});
  });
  it('registers, blocks duplicates, and checks the password', async () => {
    localStorage.clear();
    await register({ name: 'Asha', email: 'Asha@Mail.com', password: 'abc123' });
    await expect(register({ name: 'Asha', email: 'asha@mail.com', password: 'abc123' })).rejects.toThrow(/already exists/);
    await expect(authenticate({ email: 'asha@mail.com', password: 'wrong123' })).rejects.toThrow(/Incorrect/);
    await expect(authenticate({ email: 'none@mail.com', password: 'abc123' })).rejects.toThrow(/No account/);
    expect((await authenticate({ email: 'asha@mail.com', password: 'abc123' })).name).toBe('Asha');
  });
});

describe('checkout', () => {
  const base = { name: 'Asha', phone: '9876543210', address: '12 Main Road', city: 'Bhiwandi', pin: '421302', method: 'cod', upi: '', card: '', exp: '', cvv: '' };
  it('accepts a valid cash order and rejects bad fields', () => {
    expect(validateCheckout(base)).toEqual({});
    expect(validateCheckout({ ...base, phone: '123', pin: '12' })).toHaveProperty('phone');
    expect(validateCheckout({ ...base, method: 'upi' })).toHaveProperty('upi');
    expect(validateCheckout({ ...base, method: 'card' })).toHaveProperty('card');
  });
  it('stores placed orders newest first', () => {
    const s = orders(orders(undefined, placeOrder({ id: 'A' })), placeOrder({ id: 'B' }));
    expect(s.items.map((o) => o.id)).toEqual(['B', 'A']);
  });
});
