// Demo-only accounts kept in this browser's localStorage (no server).
const KEY = 'kartly:accounts';

export const getAccounts = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};

const hash = async (text) => {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return btoa(unescape(encodeURIComponent(text))); // fallback if SubtleCrypto is unavailable
  }
};

export async function register({ name, email, password }) {
  const accounts = getAccounts();
  const mail = email.trim().toLowerCase();
  if (accounts.some((a) => a.email === mail)) throw new Error('An account with this email already exists. Log in instead.');
  accounts.push({ name: name.trim(), email: mail, hash: await hash(password) });
  localStorage.setItem(KEY, JSON.stringify(accounts));
  return { name: name.trim(), email: mail };
}

export async function authenticate({ email, password }) {
  const account = getAccounts().find((a) => a.email === email.trim().toLowerCase());
  if (!account) throw new Error('No account found for this email. Sign up first.');
  if (account.hash !== (await hash(password))) throw new Error('Incorrect password. Try again.');
  return { name: account.name, email: account.email };
}
