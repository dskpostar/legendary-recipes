import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <h1 className="font-display text-6xl font-bold text-gold">404</h1>
      <p className="mt-4 text-xl text-cream/60">Recipe not found</p>
      <p className="mt-2 text-cream/30">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="mt-8">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
