import { NextRequest, NextResponse } from "next/server";
import { pollDeviceState } from "@/lib/device-auth";

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state");
  if (!state) return NextResponse.json({ complete: false });
  const result = await pollDeviceState(state);
  return NextResponse.json(result);
}
