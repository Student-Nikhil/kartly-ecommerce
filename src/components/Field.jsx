import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Field({ id, label, error, type = 'text', className = '', ...rest }) {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold">{label}</label>
      <div className="relative">
        <input id={id} type={isPw && show ? 'text' : type} className={`input ${isPw ? 'pr-12' : ''} ${error ? '!border-red-500' : ''}`}
          aria-invalid={!!error} aria-describedby={`${id}-err`} {...rest} />
        {isPw && (
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      <p id={`${id}-err`} role="alert" className="mt-1 min-h-[1.25rem] text-sm text-red-500">{error}</p>
    </div>
  );
}
