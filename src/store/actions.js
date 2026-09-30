export const T = {
  PRODUCTS_REQUEST: 'products/request',
  PRODUCTS_SUCCESS: 'products/success',
  PRODUCTS_FAILURE: 'products/failure',
  CATEGORIES_SUCCESS: 'categories/success',
  SET_CATEGORY: 'filter/category',
  SET_SEARCH: 'filter/search',
  PRODUCT_REQUEST: 'product/request',
  PRODUCT_SUCCESS: 'product/success',
  PRODUCT_FAILURE: 'product/failure',
  CART_ADD: 'cart/add',
  CART_REMOVE: 'cart/remove',
  CART_QTY: 'cart/qty',
  CART_CLEAR: 'cart/clear',
  WISH_TOGGLE: 'wish/toggle',
  THEME_SET: 'theme/set',
  LOGIN: 'user/login',
  LOGOUT: 'user/logout',
  ORDER_PLACE: 'orders/place',
};

const FAKE = 'https://fakestoreapi.com';
const DUMMY = 'https://dummyjson.com';
// Categories shown when the backup source is used
const DUMMY_CATEGORIES = ['smartphones', 'laptops', 'fragrances', 'mens-shirts', 'womens-dresses', 'sunglasses'];
let useBackup = false; // flips to true once the main API is unreachable

const getJson = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(7000) : undefined });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
};

// Convert a dummyjson product into the same shape Fake Store uses
const normalise = (p) => ({
  id: p.id,
  title: p.title,
  price: p.price,
  image: p.thumbnail || p.images?.[0],
  category: p.category,
  description: p.description,
  rating: { rate: Math.round((p.rating || 4) * 10) / 10, count: p.stock ?? 0 },
});

// Try the main API first; if it can't be reached, use the backup
async function withBackup(main, backup) {
  if (!useBackup) {
    try { return await main(); } catch { useBackup = true; }
  }
  return backup();
}

const loadProducts = (category) => withBackup(
  () => getJson(category === 'all' ? `${FAKE}/products` : `${FAKE}/products/category/${encodeURIComponent(category)}`),
  async () => {
    const url = category === 'all' || !DUMMY_CATEGORIES.includes(category) ? `${DUMMY}/products?limit=60` : `${DUMMY}/products/category/${category}`;
    return (await getJson(url)).products.map(normalise);
  }
);
const loadCategories = () => withBackup(() => getJson(`${FAKE}/products/categories`), async () => DUMMY_CATEGORIES);
const loadProduct = (id) => withBackup(() => getJson(`${FAKE}/products/${id}`), async () => normalise(await getJson(`${DUMMY}/products/${id}`)));

// ---- thunks (redux-thunk) ----
export const fetchProducts = (category = 'all') => async (dispatch) => {
  dispatch({ type: T.PRODUCTS_REQUEST });
  try {
    dispatch({ type: T.PRODUCTS_SUCCESS, payload: await loadProducts(category) });
  } catch (e) {
    dispatch({ type: T.PRODUCTS_FAILURE, error: e.message });
  }
};

export const fetchCategories = () => async (dispatch) => {
  try {
    dispatch({ type: T.CATEGORIES_SUCCESS, payload: await loadCategories() });
  } catch { /* categories are optional; the product grid still works */ }
};

export const fetchProduct = (id) => async (dispatch) => {
  dispatch({ type: T.PRODUCT_REQUEST });
  try {
    dispatch({ type: T.PRODUCT_SUCCESS, payload: await loadProduct(id) });
  } catch (e) {
    dispatch({ type: T.PRODUCT_FAILURE, error: e.message });
  }
};

// ---- plain actions ----
export const setCategory = (payload) => ({ type: T.SET_CATEGORY, payload });
export const setSearch = (payload) => ({ type: T.SET_SEARCH, payload });
export const addToCart = (product) => ({ type: T.CART_ADD, payload: product });
export const removeFromCart = (id) => ({ type: T.CART_REMOVE, payload: id });
export const setQty = (id, qty) => ({ type: T.CART_QTY, payload: { id, qty } });
export const clearCart = () => ({ type: T.CART_CLEAR });
export const toggleWishlist = (product) => ({ type: T.WISH_TOGGLE, payload: product });
export const setTheme = (payload) => ({ type: T.THEME_SET, payload });
export const login = (payload) => ({ type: T.LOGIN, payload });
export const logout = () => ({ type: T.LOGOUT });
export const placeOrder = (payload) => ({ type: T.ORDER_PLACE, payload });
