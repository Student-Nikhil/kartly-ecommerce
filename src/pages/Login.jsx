import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AuthShell from '../components/AuthShell';
import Field from '../components/Field';
import { login } from '../store/actions';
import { authenticate } from '../utils/auth';
import { validEmail } from '../utils/format';

export const validate = ({ email, password }) => {
  const e = {};
  if (!email.trim()) e.email = 'Enter your email address.';
  else if (!validEmail(email)) e.email = 'Enter a valid email, like name@example.com.';
  if (!password) e.password = 'Enter your password.';
  else if (password.length < 6) e.password = 'Use at least 6 characters.';
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) e.password = 'Include at least one letter and one number.';
  return e;
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const change = (k) => (e) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (errors[k] || errors.form) setErrors((prev) => ({ ...prev, form: undefined, [k]: errors[k] ? validate(next)[k] : undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      dispatch(login(await authenticate(form)));
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    } finally { setBusy(false); }
  };

  return (
    <AuthShell>
      <form onSubmit={submit} noValidate className="card w-full max-w-md animate-slideIn space-y-2 p-6 shadow-2xl sm:p-8">
        <div className="mb-3"><h1 className="font-display text-3xl font-extrabold">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{from === '/checkout' ? 'Log in to finish your order.' : 'Log in to keep your cart and orders with you.'}</p></div>
        <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={change('email')} error={errors.email} />
        <Field id="password" label="Password" type="password" autoComplete="current-password" value={form.password} onChange={change('password')} error={errors.password} />
        {errors.form && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">{errors.form}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full">{busy ? 'Logging in…' : 'Log in'}</button>
        <p className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">New here? <Link to="/signup" state={{ from }} className="font-bold text-brand hover:underline dark:text-brand-light">Create an account</Link></p>
      </form>
    </AuthShell>
  );
}
