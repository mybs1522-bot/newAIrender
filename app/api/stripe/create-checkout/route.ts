import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { plan } = (await req.json()) as { plan: PlanKey };
  if (!PLANS[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const { priceId, trialDays } = PLANS[plan];

  // Find or create Stripe customer
  const existing = await stripe.customers.list({ email: session.user.email, limit: 1 });
  let customerId: string;
  let hadPreviousSubscription = false;

  if (existing.data.length > 0) {
    customerId = existing.data[0].id;
    // Check if they have ever had a subscription (any status including canceled)
    const prevSubs = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 1 });
    hadPreviousSubscription = prevSubs.data.length > 0;
  } else {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name ?? undefined,
    });
    customerId = customer.id;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    subscription_data: hadPreviousSubscription ? {} : {
      trial_period_days: trialDays,
    },
    success_url: `${process.env.NEXTAUTH_URL}/render?subscribed=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/render`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
