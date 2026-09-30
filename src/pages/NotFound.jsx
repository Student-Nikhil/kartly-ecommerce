import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-x pt-36 text-center">
      <p className="font-display text-8xl font-extrabold text-brand dark:text-brand-light">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold">This page doesn’t exist</h1>
      <Link to="/" className="btn btn-primary mt-6">Go to home</Link>
    </div>
  );
}
