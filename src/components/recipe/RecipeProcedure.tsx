import type { RecipeComponent } from '../../lib/types';

interface RecipeProcedureProps {
  components: RecipeComponent[];
}

function extractYouTubeId(url: string): string | null {
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (watchMatch) return watchMatch[1];
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?\s]+)/);
  if (shortsMatch) return shortsMatch[1];
  return null;
}

export function RecipeProcedure({ components }: RecipeProcedureProps) {
  const sorted = [...components].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <ol className="space-y-8">
      {sorted.map((component, index) => {
        const youtubeId = component.video_url ? extractYouTubeId(component.video_url) : null;
        const hasMedia = component.image_url || youtubeId;

        return (
          <li key={component.id} className="flex gap-5">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="font-display text-sm font-bold text-gold">{index + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-semibold text-cream mb-3">{component.name}</h3>
              {hasMedia && (
                <div className="mb-3">
                  {youtubeId ? (
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute inset-0 w-full h-full rounded-sm"
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={component.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : component.image_url ? (
                    <img
                      src={component.image_url}
                      alt={component.name}
                      className="w-full rounded-sm object-cover max-h-64"
                    />
                  ) : null}
                </div>
              )}
              {component.instructions && (
                <p className="text-sm text-cream/70 leading-relaxed">{component.instructions}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
