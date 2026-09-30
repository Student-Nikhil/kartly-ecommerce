import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
        className="card animate-drop max-h-[85vh] w-full max-w-lg overflow-y-auto p-6 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><FiX /></button>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{children}</div>
      </div>
    </div>
  );
}
