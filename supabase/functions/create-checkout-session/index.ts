import Stripe from 'npm:stripe@17';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Init inside handler so errors are caught
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY is not set');

    const stripe = new Stripe(stripeKey);

    const PRICE_IDS: Record<string, string> = {
      pro: Deno.env.get('STRIPE_PRO_PRICE_ID') ?? '',
      elite: Deno.env.get('STRIPE_ELITE_PRICE_ID') ?? '',
    };

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error(`Auth failed: ${authError?.message ?? 'no user'}`);

    // Parse request body
    const { plan, successUrl, cancelUrl } = await req.json() as {
      plan: 'pro' | 'elite';
      successUrl: string;
      cancelUrl: string;
    };

    const priceId = PRICE_IDS[plan];
    if (!priceId) throw new Error(`Invalid plan or missing price ID for: ${plan}`);

    // Admin client to read/write profiles
    const adminSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get or create Stripe customer
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('stripe_customer_id, email, display_name')
      .eq('id', user.id)
      .single();

    if (profileError) throw new Error(`Profile fetch failed: ${profileError.message}`);

    let customerId: string;

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email ?? '',
        name: profile?.display_name ?? '',
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await adminSupabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
      },
      allow_promotion_codes: true,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
