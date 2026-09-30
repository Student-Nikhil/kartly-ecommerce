import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

export default function Stars({ rate = 0, count, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${rate} out of 5`}>
      <span className="flex text-saffron">
        {[1, 2, 3, 4, 5].map((n) =>
          rate >= n - 0.25 ? <FaStar key={n} size={size} /> : rate >= n - 0.75 ? <FaStarHalfAlt key={n} size={size} /> : <FaRegStar key={n} size={size} />
        )}
      </span>
      {count !== undefined && <span className="text-xs text-slate-500 dark:text-slate-400">({count})</span>}
    </span>
  );
}
