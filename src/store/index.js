import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers';

const PREFIX = 'kartly:';
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};
const save = (key, value) => {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
};

const prefersDark = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;

export const makeStore = (preloaded) => createStore(rootReducer, preloaded, applyMiddleware(thunk));

const store = makeStore({
  cart: load('cart', { items: [] }),
  wishlist: load('wishlist', { items: [] }),
  theme: load('theme', prefersDark ? 'dark' : 'light'),
  user: load('user', null),
  orders: load('orders', { items: [] }),
});

// Persist cart, wishlist, theme and login so they survive a refresh
let last = {};
store.subscribe(() => {
  const s = store.getState();
  ['cart', 'wishlist', 'theme', 'user', 'orders'].forEach((k) => {
    if (s[k] !== last[k]) { save(k, s[k]); last[k] = s[k]; }
  });
});

export default store;
