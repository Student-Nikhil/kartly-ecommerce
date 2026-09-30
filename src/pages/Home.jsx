import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Banner from '../components/Banner';
import Perks from '../components/Perks';
import Marquee from '../components/Marquee';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import Reveal from '../components/Reveal';
import FAQ from '../components/FAQ';
import { fetchCategories, fetchProducts, setSearch } from '../store/actions';

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, error, category, search } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts(category));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? items.filter((p) => p.title.toLowerCase().includes(q)) : items;
  }, [items, search]);

  return (
    <>
      <Banner />
      <Perks />

      <section id="shop" className="container-x pt-20">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Shop by category</h2>
          <p className="mb-6 mt-2 text-slate-600 dark:text-slate-400">{search ? `Results for “${search}”` : 'Pick a category or browse everything.'}</p>
        </Reveal>
        <CategoryFilter />

        <div className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {status === 'loading' && Array.from({ length: 8 }, (_, n) => <ProductSkeleton key={n} />)}
          {status !== 'loading' && shown.map((p, n) => (
            <Reveal key={p.id} delay={(n % 4) * 80}><ProductCard product={p} /></Reveal>
          ))}
        </div>

        {status === 'error' && (
          <div className="card mx-auto mt-6 max-w-md p-6 text-center">
            <p className="font-bold">We couldn’t load products.</p>
            <p className="mt-1 text-sm text-slate-500">{error}. Check your connection and try again.</p>
            <button className="btn btn-primary mt-4" onClick={() => dispatch(fetchProducts(category))}>Try again</button>
          </div>
        )}
        {status === 'ready' && shown.length === 0 && (
          <div className="card mx-auto mt-6 max-w-md p-6 text-center">
            <p className="font-bold">No products match “{search}”.</p>
            <p className="mt-1 text-sm text-slate-500">Try a shorter name or clear the search.</p>
            <button className="btn btn-primary mt-4" onClick={() => dispatch(setSearch(''))}>Clear search</button>
          </div>
        )}
      </section>

      <div className="mt-20"><Marquee /></div>

      <section className="container-x pt-20">
        <Reveal><h2 className="mb-8 text-center font-display text-3xl font-extrabold sm:text-4xl">Questions, answered</h2></Reveal>
        <FAQ />
      </section>
    </>
  );
}
