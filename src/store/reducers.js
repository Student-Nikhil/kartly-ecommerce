import { combineReducers } from 'redux';
import { T } from './actions';

const slim = ({ id, title, price, image, category, rating }) => ({ id, title, price, image, category, rating });

export const productsInitial = {
  items: [], categories: [], status: 'idle', error: null, category: 'all', search: '',
  current: null, currentStatus: 'idle',
};

export function products(state = productsInitial, a) {
  switch (a.type) {
    case T.PRODUCTS_REQUEST: return { ...state, status: 'loading', error: null };
    case T.PRODUCTS_SUCCESS: return { ...state, status: 'ready', items: a.payload };
    case T.PRODUCTS_FAILURE: return { ...state, status: 'error', error: a.error };
    case T.CATEGORIES_SUCCESS: return { ...state, categories: a.payload };
    case T.SET_CATEGORY: return { ...state, category: a.payload };
    case T.SET_SEARCH: return { ...state, search: a.payload };
    case T.PRODUCT_REQUEST: return { ...state, currentStatus: 'loading', current: null };
    case T.PRODUCT_SUCCESS: return { ...state, currentStatus: 'ready', current: a.payload };
    case T.PRODUCT_FAILURE: return { ...state, currentStatus: 'error' };
    default: return state;
  }
}

export function cart(state = { items: [] }, a) {
  switch (a.type) {
    case T.CART_ADD: {
      if (state.items.some((i) => i.id === a.payload.id)) return state;
      return { items: [...state.items, { ...slim(a.payload), qty: 1 }] };
    }
    case T.CART_REMOVE: return { items: state.items.filter((i) => i.id !== a.payload) };
    case T.CART_QTY:
      return { items: state.items.map((i) => (i.id === a.payload.id ? { ...i, qty: Math.max(1, Math.min(10, a.payload.qty)) } : i)) };
    case T.CART_CLEAR: return { items: [] };
    default: return state;
  }
}

export function wishlist(state = { items: [] }, a) {
  if (a.type !== T.WISH_TOGGLE) return state;
  const has = state.items.some((i) => i.id === a.payload.id);
  return { items: has ? state.items.filter((i) => i.id !== a.payload.id) : [...state.items, slim(a.payload)] };
}

export const theme = (state = 'light', a) => (a.type === T.THEME_SET ? a.payload : state);

export function user(state = null, a) {
  if (a.type === T.LOGIN) return a.payload;
  if (a.type === T.LOGOUT) return null;
  return state;
}

export function orders(state = { items: [] }, a) {
  return a.type === T.ORDER_PLACE ? { items: [a.payload, ...state.items] } : state;
}

export default combineReducers({ products, cart, wishlist, theme, user, orders });
