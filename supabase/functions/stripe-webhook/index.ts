import Stripe from 'npm:stripe@17';
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!stripeKey || !webhookSecret) {
    return new Response('Stripe env vars not set', { status: 500 });
  }

  const stripe = new Stripe(stripeKey);

  const PRICE_TO_PLAN: Record<string, 'pro' | 'elite'> = {
    [Deno.env.get('STRIPE_PRO_PRICE_ID') ?? '']: 'pro',
    [Deno.env.get('STRIPE_ELITE_PRICE_ID') ?? '']: 'elite',
  };

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) return new Response('Missing signature', { status: 400 });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response(`Webhook Error: ${String(err)}`, { status: 400 });
  }

  const adminSupabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  async function updatePlan(customerId: string, plan: 'free' | 'pro' | 'elite') {
    await adminSupabase
      .from('profiles')
      .update({ membership_plan: plan })
      .eq('stripe_customer_id', customerId);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') break;

        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const plan = (session.metadata?.plan as 'pro' | 'elite') ?? 'pro';

        await updatePlan(customerId, plan);
        await adminSupabase
          .from('profiles')
          .update({ stripe_subscription_id: subscriptionId })
          .eq('stripe_customer_id', customerId);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price.id;
        const plan = priceId ? PRICE_TO_PLAN[priceId] : undefined;

        if (subscription.status === 'active' && plan) {
          await updatePlan(customerId, plan);
          await adminSupabase
            .from('profiles')
            .update({ stripe_subscription_id: subscription.id })
            .eq('stripe_customer_id', customerId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        await updatePlan(customerId, 'free');
        await adminSupabase
          .from('profiles')
          .update({ stripe_subscription_id: null })
          .eq('stripe_customer_id', customerId);
        break;
      }
    }
  } catch (err) {
    console.error(`Error handling ${event.type}:`, err);
    return new Response('Handler error', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
