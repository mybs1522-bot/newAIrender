import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const DATA_FILE = path.join(process.cwd(), "data", "otp.json");
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface OTPEntry {
  email: string;
  code: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
}

async function readData(): Promise<Record<string, OTPEntry>> {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf-8"));
  } catch {
    return {};
  }
}

async function writeData(data: Record<string, OTPEntry>) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function createOTP(email: string): Promise<string> {
  const code = String(Math.floor(100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
  const data = await readData();
  // Clean expired
  const now = Date.now();
  for (const k of Object.keys(data)) {
    if (data[k].expiresAt < now) delete data[k];
  }
  data[email] = { email, code, createdAt: now, expiresAt: now + OTP_TTL_MS, attempts: 0 };
  await writeData(data);
  return code;
}

export async function verifyOTP(email: string, code: string): Promise<boolean> {
  const data = await readData();
  const entry = data[email];
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    delete data[email];
    await writeData(data);
    return false;
  }
  entry.attempts += 1;
  if (entry.attempts > 5) {
    delete data[email];
    await writeData(data);
    return false;
  }
  if (entry.code !== code.trim()) {
    await writeData(data);
    return false;
  }
  delete data[email];
  await writeData(data);
  return true;
}
