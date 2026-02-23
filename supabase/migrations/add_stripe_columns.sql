-- Add Stripe billing columns to profiles
-- Run this in Supabase SQL Editor

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id     text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE;

-- Index for webhook lookups by customer ID
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
  ON profiles (stripe_customer_id);
