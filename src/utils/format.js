// FakeStore has no discounts, so derive a stable one from the product id.
export const discountFor = (id) => [10, 15, 20, 25, 30][id % 5];
export const originalPrice = (price, id) => price / (1 - discountFor(id) / 100);
export const money = (n) => `$${Number(n).toFixed(2)}`;
export const titleCase = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
export const deliveryDate = (days = 4) => {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
};
export const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const totals = (items) => {
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const shipping = subtotal === 0 || subtotal > 50 ? 0 : 4.99;
  return { subtotal, shipping, total: subtotal + shipping };
};
