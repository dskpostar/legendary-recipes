import type { Ingredient } from '../../lib/types';

interface IngredientListProps {
  ingredients: Ingredient[];
  scale: number;
}

export function IngredientList({ ingredients, scale }: IngredientListProps) {
  const sorted = [...ingredients].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <ul className="space-y-2">
      {sorted.map((ing) => {
        const scaledQty = Math.round(ing.quantity * scale * 100) / 100;
        return (
          <li key={ing.id} className="flex items-baseline gap-2 text-sm">
            <span className="text-gold font-medium min-w-[3rem] text-right">
              {scaledQty} {ing.unit}
            </span>
            <span className="text-cream/80">{ing.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
