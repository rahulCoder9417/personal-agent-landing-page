import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb(url: string) {
  return drizzle(neon(url), { schema });
}

let db: ReturnType<typeof createDb> | undefined;

// Created on first use so builds and pages that don't touch the database never need DATABASE_URL.
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  db ??= createDb(url);
  return db;
}
