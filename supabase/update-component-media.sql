-- ============================================================
-- Recipe Component Media: video_url & image_url updates
-- Run in Supabase SQL Editor after add_media_to_components.sql
-- ============================================================

-- ── Recipe 1: Forager's Wild Herb Salad ──────────────────────
UPDATE recipe_components SET
  video_url  = 'https://www.youtube.com/watch?v=m9eoysWdxLc',
  image_url  = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=450&fit=crop'
WHERE id = 'comp-1-1';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800&h=450&fit=crop'
WHERE id = 'comp-1-2';

-- ── Recipe 2: Sea Urchin & Buttermilk ────────────────────────
UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&h=450&fit=crop'
WHERE id = 'comp-2-1';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&h=450&fit=crop'
WHERE id = 'comp-2-2';

-- ── Recipe 3: Five Ages of Parmigiano Reggiano ───────────────
UPDATE recipe_components SET
  video_url  = 'https://www.youtube.com/watch?v=fb6gZmLw1no',
  image_url  = 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=450&fit=crop'
WHERE id = 'comp-3-1';

UPDATE recipe_components SET
  video_url  = 'https://www.youtube.com/watch?v=LO4ZXsyI6AU',
  image_url  = 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=450&fit=crop'
WHERE id = 'comp-3-2';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&h=450&fit=crop'
WHERE id = 'comp-3-3';

-- ── Recipe 4: Oops! I Dropped the Lemon Tart ─────────────────
UPDATE recipe_components SET
  video_url  = 'https://www.youtube.com/watch?v=XAizxrBpUVA',
  image_url  = 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&h=450&fit=crop'
WHERE id = 'comp-4-1';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=450&fit=crop'
WHERE id = 'comp-4-2';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&h=450&fit=crop'
WHERE id = 'comp-4-3';

-- ── Recipe 5: Walking on the Ocean Floor ─────────────────────
UPDATE recipe_components SET
  video_url  = 'https://www.youtube.com/watch?v=o5VPONMX19Q',
  image_url  = 'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?w=800&h=450&fit=crop'
WHERE id = 'comp-5-1';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=450&fit=crop'
WHERE id = 'comp-5-2';

-- ── Recipe 6: Brioche Feuilletée ─────────────────────────────
UPDATE recipe_components SET
  video_url  = 'https://www.youtube.com/shorts/jlxyDgEh7ak',
  image_url  = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=450&fit=crop'
WHERE id = 'comp-6-1';

UPDATE recipe_components SET
  video_url  = 'https://www.youtube.com/shorts/jlxyDgEh7ak',
  image_url  = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=450&fit=crop'
WHERE id = 'comp-6-2';

-- ── Recipe 7: Soil of the Forest ─────────────────────────────
UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=450&fit=crop'
WHERE id = 'comp-7-1';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&h=450&fit=crop'
WHERE id = 'comp-7-2';

-- ── Recipe 8: Sakura Masu with Cherry Blossom ────────────────
UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=450&fit=crop'
WHERE id = 'comp-8-1';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop'
WHERE id = 'comp-8-2';

-- ── Recipe 9: Edible Stones ──────────────────────────────────
UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=450&fit=crop'
WHERE id = 'comp-9-1';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1472476443507-c7f0c34f3b88?w=800&h=450&fit=crop'
WHERE id = 'comp-9-2';

-- ── Recipe 10: Burnt Onion Ash Broth ─────────────────────────
UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=450&fit=crop'
WHERE id = 'comp-10-1';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=800&h=450&fit=crop'
WHERE id = 'comp-10-2';

-- ── Recipe 11: Tortellini in Brodo ───────────────────────────
UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=450&fit=crop'
WHERE id = 'comp-11-1';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=450&fit=crop'
WHERE id = 'comp-11-2';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=450&fit=crop'
WHERE id = 'comp-11-3';

-- ── Recipe 12: Fermented Mushroom Garum ──────────────────────
UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=800&h=450&fit=crop'
WHERE id = 'comp-12-1';

UPDATE recipe_components SET
  image_url  = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop'
WHERE id = 'comp-12-2';

-- ── World 50 Best additions (seed-world50best.sql components) ─
-- Gaggan Anand
UPDATE recipe_components SET
  video_url  = 'https://www.youtube.com/watch?v=IE0LoZaCVtE'
WHERE recipe_id IN (SELECT id FROM recipes WHERE chef_id IN (SELECT id FROM chefs WHERE display_name ILIKE '%Gaggan%'));

-- Ana Roš
UPDATE recipe_components SET
  video_url  = 'https://www.youtube.com/watch?v=Y1zAlju83vc'
WHERE recipe_id IN (SELECT id FROM recipes WHERE chef_id IN (SELECT id FROM chefs WHERE display_name ILIKE '%Ana Ro%'));
