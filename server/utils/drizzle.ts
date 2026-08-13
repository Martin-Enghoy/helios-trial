import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../database/schema";

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || "file:./sqlite.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });