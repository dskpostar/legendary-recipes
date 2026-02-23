import { useState } from 'react';
import type { RecipeComponent, Ingredient } from '../../lib/types';
import { IngredientList } from './IngredientList';

interface ComponentCardProps {
  component: RecipeComponent;
  ingredients: Ingredient[];
  scale: number;
  defaultOpen?: boolean;
}

function extractYouTubeId(url: string): string | null {
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (watchMatch) return watchMatch[1];
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?\s]+)/);
  if (shortsMatch) return shortsMatch[1];
  return null;
}

export function ComponentCard({ component, ingredients, scale, defaultOpen = false }: ComponentCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  const youtubeId = component.video_url ? extractYouTubeId(component.video_url) : null;

  return (
    <div className="border border-black/10 rounded-none overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-black/5 transition-colors"
      >
        <h3 className="font-display text-lg font-semibold text-cream">{component.name}</h3>
        <svg
          className={`w-5 h-5 text-cream/40 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          {component.image_url && (
            <img
              src={component.image_url}
              alt={component.name}
              className="w-full rounded-sm object-cover max-h-64"
            />
          )}
          {youtubeId && (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-sm"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={component.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          {ingredients.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gold/70 uppercase tracking-wider mb-3">Ingredients</h4>
              <IngredientList ingredients={ingredients} scale={scale} />
            </div>
          )}
          {component.instructions && (
            <div>
              <h4 className="text-xs font-semibold text-gold/70 uppercase tracking-wider mb-2">Instructions</h4>
              <p className="text-sm text-cream/70 leading-relaxed whitespace-pre-line">{component.instructions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
