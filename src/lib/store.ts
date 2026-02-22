import { useState, useEffect, useCallback } from 'react';
import type { Chef, Recipe, RecipeComponent, Ingredient, Collection, CollectionRecipe, UserLike, Comment, ChefFollow } from './types';
import { SEED_CHEFS, SEED_RECIPES, SEED_COMPONENTS, SEED_INGREDIENTS, SEED_COLLECTIONS, SEED_COLLECTION_RECIPES } from './seed-data';
import { supabase, isSupabaseConfigured } from './supabase';

export interface LocalCollection<T> {
  items: T[];
  getById: (id: string) => T | undefined;
  getByField: (field: keyof T, value: unknown) => T[];
  addItem: (item: T) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<T>) => void;
}

// Map from hook name to Supabase table name
const TABLE_NAMES: Record<string, string> = {
  lr_chefs: 'chefs',
  lr_recipes: 'recipes',
  lr_components: 'recipe_components',
  lr_ingredients: 'ingredients',
  lr_collections: 'collections',
  lr_collection_recipes: 'collection_recipes',
  lr_likes: 'user_likes',
  lr_comments: 'comments',
  lr_follows: 'chef_follows',
};

function useSupabaseTable<T extends { id: string }>(key: string, seedData: T[]): LocalCollection<T> {
  const [items, setItems] = useState<T[]>(seedData);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const tableName = TABLE_NAMES[key];
    if (!tableName) return;

    supabase
      .from(tableName)
      .select('*')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setItems(data as T[]);
        }
        // On error or empty result, keep seedData already set as initial state
      });
  }, [key]);

  const getById = useCallback(
    (id: string) => items.find((item) => item.id === id),
    [items]
  );

  const getByField = useCallback(
    (field: keyof T, value: unknown) => items.filter((item) => item[field] === value),
    [items]
  );

  const addItem = useCallback(
    (item: T) => {
      setItems((prev) => [...prev, item]);

      if (isSupabaseConfigured && supabase) {
        const tableName = TABLE_NAMES[key];
        if (tableName) {
          supabase
            .from(tableName)
            .insert(item)
            .then(({ error }) => {
              if (error) {
                console.error(`Failed to insert into ${tableName}:`, error.message);
                setItems((prev) => prev.filter((i) => i.id !== item.id));
              }
            });
        }
      }
    },
    [key]
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));

      if (isSupabaseConfigured && supabase) {
        const tableName = TABLE_NAMES[key];
        if (tableName) {
          supabase
            .from(tableName)
            .delete()
            .eq('id', id)
            .then(({ error }) => {
              if (error) {
                console.error(`Failed to delete from ${tableName}:`, error.message);
              }
            });
        }
      }
    },
    [key]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<T>) => {
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));

      if (isSupabaseConfigured && supabase) {
        const tableName = TABLE_NAMES[key];
        if (tableName) {
          supabase
            .from(tableName)
            .update(updates)
            .eq('id', id)
            .then(({ error }) => {
              if (error) {
                console.error(`Failed to update ${tableName}:`, error.message);
              }
            });
        }
      }
    },
    [key]
  );

  return { items, getById, getByField, addItem, removeItem, updateItem };
}

export function useChefs() {
  return useSupabaseTable<Chef>('lr_chefs', SEED_CHEFS);
}

export function useRecipes() {
  return useSupabaseTable<Recipe>('lr_recipes', SEED_RECIPES);
}

export function useComponents() {
  return useSupabaseTable<RecipeComponent>('lr_components', SEED_COMPONENTS);
}

export function useIngredients() {
  return useSupabaseTable<Ingredient>('lr_ingredients', SEED_INGREDIENTS);
}

export function useCollections() {
  return useSupabaseTable<Collection>('lr_collections', SEED_COLLECTIONS);
}

export function useCollectionRecipes() {
  return useSupabaseTable<CollectionRecipe>('lr_collection_recipes', SEED_COLLECTION_RECIPES);
}

export function useLikes() {
  return useSupabaseTable<UserLike>('lr_likes', []);
}

export function useComments() {
  return useSupabaseTable<Comment>('lr_comments', []);
}

export function useChefFollows() {
  return useSupabaseTable<ChefFollow>('lr_follows', []);
}
