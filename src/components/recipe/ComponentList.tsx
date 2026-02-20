import type { RecipeComponent, Ingredient } from '../../lib/types';
import { ComponentCard } from './ComponentCard';

interface ComponentListProps {
  components: RecipeComponent[];
  ingredients: Ingredient[];
  scale: number;
}

export function ComponentList({ components, ingredients, scale }: ComponentListProps) {
  const sorted = [...components].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-3">
      {sorted.map((comp, index) => (
        <ComponentCard
          key={comp.id}
          component={comp}
          ingredients={ingredients.filter((ing) => ing.component_id === comp.id)}
          scale={scale}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}
