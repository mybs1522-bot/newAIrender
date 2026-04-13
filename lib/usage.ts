import fs from "fs/promises";
import path from "path";
import os from "os";

export const TRIAL_GENERATION_LIMIT = 3;

const DATA_DIR = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "usage.json");

type UsageStore = Record<string, number>;

async function readStore(): Promise<UsageStore> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as UsageStore;
  } catch {
    return {};
  }
}

async function writeStore(store: UsageStore): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2));
}

export async function getGenerationCount(email: string): Promise<number> {
  const store = await readStore();
  return store[email] ?? 0;
}

export async function incrementGenerationCount(email: string): Promise<number> {
  const store = await readStore();
  const next = (store[email] ?? 0) + 1;
  store[email] = next;
  await writeStore(store);
  return next;
}
