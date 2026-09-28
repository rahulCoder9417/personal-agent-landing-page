import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't read Next's env files, so load .env.local ourselves when it exists.
try {
  process.loadEnvFile(".env.local");
} catch {
  // no .env.local: rely on the shell environment
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
  strict: true,
});
