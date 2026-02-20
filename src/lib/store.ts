import { useState, useEffect, useCallback } from 'react';
import type { Chef, Recipe, RecipeComponent, Ingredient, Collection, CollectionRecipe, UserLike, Comment } from './types';
import { SEED_CHEFS, SEED_RECIPES, SEED_COMPONENTS, SEED_INGREDIENTS, SEED_COLLECTIONS, SEED_COLLECTION_RECIPES } from './seed-data';

export interface LocalCollection<T> {
  items: T[];
  getById: (id: string) => T | undefined;
  getByField: (field: keyof T, value: unknown) => T[];
  addItem: (item: T) => void;
  removeItem: (id: string) => void;
}

function useLocalCollection<T>(key: string, seedData: T[]): LocalCollection<T> {
  const [items, setItems] = useState<T[]>(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    localStorage.setItem(key, JSON.stringify(seedData));
    return seedData;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items));
  }, [key, items]);

  // Ensure seed data is loaded if storage is empty
  useEffect(() => {
    if (items.length === 0 && seedData.length > 0) {
      setItems(seedData);
    }
  }, [items.length, seedData]);

  const getById = useCallback(
    (id: string) => items.find((item) => (item as Record<string, unknown>).id === id),
    [items]
  );

  const getByField = useCallback(
    (field: keyof T, value: unknown) => items.filter((item) => item[field] === value),
    [items]
  );

  const addItem = useCallback(
    (item: T) => setItems((prev) => [...prev, item]),
    []
  );

  const removeItem = useCallback(
    (id: string) => setItems((prev) => prev.filter((item) => (item as Record<string, unknown>).id !== id)),
    []
  );

  return { items, getById, getByField, addItem, removeItem };
}

export function useChefs() {
  return useLocalCollection<Chef>('lr_chefs', SEED_CHEFS);
}

export function useRecipes() {
  return useLocalCollection<Recipe>('lr_recipes', SEED_RECIPES);
}

export function useComponents() {
  return useLocalCollection<RecipeComponent>('lr_components', SEED_COMPONENTS);
}

export function useIngredients() {
  return useLocalCollection<Ingredient>('lr_ingredients', SEED_INGREDIENTS);
}

export function useCollections() {
  return useLocalCollection<Collection>('lr_collections', SEED_COLLECTIONS);
}

export function useCollectionRecipes() {
  return useLocalCollection<CollectionRecipe>('lr_collection_recipes', SEED_COLLECTION_RECIPES);
}

export function useLikes() {
  return useLocalCollection<UserLike>('lr_likes', []);
}

export function useComments() {
  return useLocalCollection<Comment>('lr_comments', []);
}
