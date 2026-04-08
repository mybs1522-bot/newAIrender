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

  try {
    const customers = await stripe.customers.list({ email: session.user.email, limit: 1 });
    if (customers.data.length === 0) {
      return NextResponse.json({ error: "No customer found" }, { status: 404 });
    }

    const subs = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "all",
      limit: 5,
    });

    const active = subs.data.find((s) => s.status === "active" || s.status === "trialing");
    if (!active) {
      return NextResponse.json({ error: "No active subscription" }, { status: 404 });
    }

    const updated = await stripe.subscriptions.update(active.id, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({ cancelAtPeriodEnd: updated.cancel_at_period_end });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
