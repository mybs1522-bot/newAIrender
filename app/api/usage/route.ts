import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGenerationCount, TRIAL_GENERATION_LIMIT } from "@/lib/usage";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({
      count: 0,
      limit: TRIAL_GENERATION_LIMIT,
      trialRemaining: TRIAL_GENERATION_LIMIT,
    });
  }
  const count = await getGenerationCount(session.user.email);
  const trialRemaining = Math.max(0, TRIAL_GENERATION_LIMIT - count);
  return NextResponse.json({
    count,
    limit: TRIAL_GENERATION_LIMIT,
    trialRemaining,
  });
}
