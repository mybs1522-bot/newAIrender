import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 500 }
    );
  }

  const email = session.user.email;

  // Find or create Stripe customer
  const existing = await stripe.customers.list({ email, limit: 1 });
  let customerId: string;

  if (existing.data.length > 0) {
    customerId = existing.data[0].id;
  } else {
    const customer = await stripe.customers.create({
      email,
      name: session.user.name ?? undefined,
    });
    customerId = customer.id;
  }

  // Check for saved payment methods
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });

  // Check if user had any prior subscription
  const prevSubs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 1,
  });
  const hadTrial = prevSubs.data.length > 0;

  if (paymentMethods.data.length > 0) {
    // Has saved card — create subscription directly without checkout redirect
    const pm = paymentMethods.data[0];
    const subParams: Parameters<typeof stripe.subscriptions.create>[0] = {
      customer: customerId,
      items: [{ price: PLANS.monthly.priceId }],
      default_payment_method: pm.id,
    };
    if (!hadTrial) {
      subParams.trial_period_days = PLANS.monthly.trialDays;
    }
    await stripe.subscriptions.create(subParams);
    return NextResponse.json({ activated: true });
  }

  // No saved card — redirect to Stripe Checkout
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: PLANS.monthly.priceId, quantity: 1 }],
    mode: "subscription",
    subscription_data: hadTrial
      ? {}
      : { trial_period_days: PLANS.monthly.trialDays },
    success_url: `${process.env.NEXTAUTH_URL}/render?subscribed=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/render`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
