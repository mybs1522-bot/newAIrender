import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createOTP } from "@/lib/otp";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { code, token } = createOTP(email.toLowerCase().trim());

  const { error } = await resend.emails.send({
    from: "Interior Designer AI <design@avada.space>",
    to: email,
    subject: `${code} — Your sign-in code`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
        <div style="text-align:center;margin-bottom:32px">
          <div style="width:56px;height:56px;background:#6366f1;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
            <span style="color:white;font-size:28px">✦</span>
          </div>
          <h1 style="margin:0;font-size:22px;font-weight:700;color:#111">Interior Designer AI</h1>
        </div>
        <p style="color:#555;margin-bottom:8px">Your sign-in code is:</p>
        <div style="background:#f5f5f5;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
          <span style="font-size:40px;font-weight:800;letter-spacing:8px;color:#111;font-family:monospace">${code}</span>
        </div>
        <p style="color:#888;font-size:13px">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", JSON.stringify(error));
    return NextResponse.json(
      { error: "Failed to send email", detail: (error as { message?: string }).message ?? String(error) },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, token });
}
