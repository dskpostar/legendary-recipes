import { createContext, useContext, type ReactNode } from 'react';
import type { Chef, Recipe, RecipeComponent, Ingredient, Collection, CollectionRecipe, UserLike, Comment } from './types';
import type { LocalCollection } from './store';
import { useChefs, useRecipes, useComponents, useIngredients, useCollections, useCollectionRecipes, useLikes, useComments } from './store';

interface AppContextValue {
  chefs: LocalCollection<Chef>;
  recipes: LocalCollection<Recipe>;
  components: LocalCollection<RecipeComponent>;
  ingredients: LocalCollection<Ingredient>;
  collections: LocalCollection<Collection>;
  collectionRecipes: LocalCollection<CollectionRecipe>;
  likes: LocalCollection<UserLike>;
  comments: LocalCollection<Comment>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const chefs = useChefs();
  const recipes = useRecipes();
  const components = useComponents();
  const ingredients = useIngredients();
  const collections = useCollections();
  const collectionRecipes = useCollectionRecipes();
  const likes = useLikes();
  const comments = useComments();

  return (
    <AppContext.Provider value={{ chefs, recipes, components, ingredients, collections, collectionRecipes, likes, comments }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
