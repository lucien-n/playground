import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const initDb = () => {
  const dbUrl = process.env.DB_URL;
  const dbAuthToken = process.env.DB_AUTH_TOKEN;

  if (!dbUrl) throw new Error("Could not load env variale 'DB_URL'");
  if (!dbUrl) throw new Error("Could not load env variale 'DB_AUTH_TOKEN'");

  const client = createClient({ url: dbUrl, authToken: dbAuthToken });

  const db = drizzle(client);

  return db;
};
