// app/(lib)/db.ts
import { MongoClient } from "mongodb";

let cachedClient: MongoClient | null = null;

export async function connectToDB() {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI in .env.local");
  }

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}
