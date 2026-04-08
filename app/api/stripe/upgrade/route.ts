import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const email = session.user.email;

  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length === 0) {
    return NextResponse.json({ error: "No Stripe customer found" }, { status: 404 });
  }

  const subs = await stripe.subscriptions.list({
    customer: customers.data[0].id,
    status: "trialing",
    limit: 1,
  });

  if (subs.data.length === 0) {
    return NextResponse.json({ error: "No active trial found" }, { status: 404 });
  }

  const upgraded = await stripe.subscriptions.update(subs.data[0].id, {
    trial_end: "now",
  });

  return NextResponse.json({ status: upgraded.status });
}
