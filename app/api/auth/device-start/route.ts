import { NextResponse } from "next/server";
import { createDeviceState } from "@/lib/device-auth";

export async function POST() {
  const state = await createDeviceState();
  return NextResponse.json({ state });
}
