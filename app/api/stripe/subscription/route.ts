import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ subscribed: false, status: null });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ subscribed: false, status: null });
  }

  try {
    const customers = await stripe.customers.list({ email: session.user.email, limit: 1 });
    if (customers.data.length === 0) {
      return NextResponse.json({ subscribed: false, status: null });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "all",
      limit: 5,
    });

    const active = subscriptions.data.find(
      (s) => s.status === "active" || s.status === "trialing"
    );

    const hadTrial = subscriptions.data.length > 0;

    if (!active) {
      return NextResponse.json({ subscribed: false, status: null, hadTrial });
    }

    const item = active.items.data[0];
    const price = item?.price;
    const interval = price?.recurring?.interval ?? null;
    const amount = price?.unit_amount ?? null;

    return NextResponse.json({
      subscribed: true,
      status: active.status,
      trialEnd: active.trial_end ?? null,
      currentPeriodEnd: (active as unknown as Record<string, unknown>)["current_period_end"] ?? null,
      cancelAtPeriodEnd: active.cancel_at_period_end ?? false,
      subscriptionId: active.id,
      plan: interval === "year" ? "Yearly" : "Monthly",
      amount,
      interval,
      hadTrial,
    });
  } catch {
    return NextResponse.json({ subscribed: false, status: null });
  }
}
