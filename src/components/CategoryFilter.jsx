import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setCategory } from '../store/actions';
import { titleCase } from '../utils/format';

export default function CategoryFilter() {
  const dispatch = useDispatch();
  const { categories, category } = useSelector((s) => s.products);
  const pick = (c) => { dispatch(setCategory(c)); dispatch(fetchProducts(c)); };

  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
      {['all', ...categories].map((c) => (
        <button key={c} onClick={() => pick(c)} aria-pressed={category === c}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition duration-200 active:scale-95 ${category === c
            ? 'border-brand bg-brand text-white dark:border-brand-light dark:bg-brand-light dark:text-ink-900'
            : 'border-slate-300 bg-white hover:border-brand dark:border-ink-600 dark:bg-ink-800 dark:hover:border-brand-light'}`}>
          {c === 'all' ? 'All products' : titleCase(c)}
        </button>
      ))}
    </div>
  );
}
