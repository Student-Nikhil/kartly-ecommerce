import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AuthShell from '../components/AuthShell';
import Field from '../components/Field';
import { login } from '../store/actions';
import { register } from '../utils/auth';
import { validEmail } from '../utils/format';

export const validateSignup = ({ name, email, password, confirm }) => {
  const e = {};
  if (name.trim().length < 2) e.name = 'Enter your name (at least 2 characters).';
  if (!validEmail(email)) e.email = 'Enter a valid email, like name@example.com.';
  if (password.length < 6) e.password = 'Use at least 6 characters.';
  else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) e.password = 'Include at least one letter and one number.';
  if (confirm !== password) e.confirm = 'Passwords do not match.';
  return e;
};

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/';
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const change = (k) => (e) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (errors[k] || errors.form) setErrors((prev) => ({ ...prev, form: undefined, [k]: errors[k] ? validateSignup(next)[k] : undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validateSignup(form);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy(true);
    try {
      dispatch(login(await register(form)));
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({ form: err.message });
    } finally { setBusy(false); }
  };

  return (
    <AuthShell>
      <form onSubmit={submit} noValidate className="card w-full max-w-md animate-slideIn space-y-2 p-6 shadow-2xl sm:p-8">
        <div className="mb-3"><h1 className="font-display text-3xl font-extrabold">Create your account</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">It takes under a minute.</p></div>
        <Field id="name" label="Full name" autoComplete="name" value={form.name} onChange={change('name')} error={errors.name} />
        <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={change('email')} error={errors.email} />
        <Field id="password" label="Password" type="password" autoComplete="new-password" value={form.password} onChange={change('password')} error={errors.password} />
        <Field id="confirm" label="Confirm password" type="password" autoComplete="new-password" value={form.confirm} onChange={change('confirm')} error={errors.confirm} />
        {errors.form && (
          <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-500">
            {errors.form} <Link to="/login" state={{ from }} className="font-bold underline">Log in</Link>
          </p>
        )}
        <button type="submit" disabled={busy} className="btn btn-primary w-full">{busy ? 'Creating account…' : 'Sign up'}</button>
        <p className="pt-2 text-center text-sm text-slate-600 dark:text-slate-400">Already have an account? <Link to="/login" state={{ from }} className="font-bold text-brand hover:underline dark:text-brand-light">Log in</Link></p>
      </form>
    </AuthShell>
  );
}
