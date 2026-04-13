import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import os from "os";

const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "device-auth.json");

interface DeviceAuthEntry {
  state: string;
  status: "pending" | "complete";
  transferToken?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  userImage?: string;
  createdAt: number;
  expiresAt: number;
}

async function readData(): Promise<Record<string, DeviceAuthEntry>> {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function writeData(data: Record<string, DeviceAuthEntry>): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function createDeviceState(): Promise<string> {
  const state = crypto.randomBytes(16).toString("hex");
  const data = await readData();
  // Clean expired entries while we're here
  const now = Date.now();
  for (const key of Object.keys(data)) {
    if (data[key].expiresAt < now) delete data[key];
  }
  data[state] = {
    state,
    status: "pending",
    createdAt: now,
    expiresAt: now + 10 * 60 * 1000, // 10 min TTL
  };
  await writeData(data);
  return state;
}

export async function createTransferToken(
  state: string,
  user: {
    id?: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  }
): Promise<string | null> {
  const data = await readData();
  const entry = data[state];
  if (!entry || entry.status !== "pending" || Date.now() > entry.expiresAt) {
    return null;
  }
  const transferToken = crypto.randomBytes(32).toString("hex");
  data[state] = {
    ...entry,
    status: "complete",
    transferToken,
    userId: user.id ?? undefined,
    userEmail: user.email ?? undefined,
    userName: user.name ?? undefined,
    userImage: user.image ?? undefined,
  };
  await writeData(data);
  return transferToken;
}

export async function pollDeviceState(
  state: string
): Promise<{ complete: boolean; transferToken?: string }> {
  const data = await readData();
  const entry = data[state];
  if (!entry) return { complete: false };
  if (Date.now() > entry.expiresAt) {
    delete data[state];
    await writeData(data);
    return { complete: false };
  }
  if (entry.status === "complete" && entry.transferToken) {
    return { complete: true, transferToken: entry.transferToken };
  }
  return { complete: false };
}

export async function consumeTransferToken(transferToken: string): Promise<{
  userId?: string;
  userEmail?: string;
  userName?: string;
  userImage?: string;
} | null> {
  const data = await readData();
  const entry = Object.values(data).find(
    (e) => e.transferToken === transferToken && e.status === "complete"
  );
  if (!entry) return null;
  delete data[entry.state];
  await writeData(data);
  return {
    userId: entry.userId,
    userEmail: entry.userEmail,
    userName: entry.userName,
    userImage: entry.userImage,
  };
}
