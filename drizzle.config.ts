/// <reference types="node" />
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  dbCredentials: {
    url:  process.env.TURSO_CONNECTION_URL || "file:./sqlite.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
});