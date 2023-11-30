import { createClient, type Client } from "@libsql/client";
import { logger } from "./logger";

export const initDb = () => {
  const url = process.env.DB_URL;
  const authToken = process.env.DB_AUTH_TOKEN;

  if (!url) throw new Error("Could not load environment variable DB_URL'' ");
  if (!authToken)
    throw new Error("Could not load environment variable 'DB_AUTH_TOKEN' ");

  const client = createClient({
    url,
    authToken,
  });

  createTables(client);
  createTestUser(client);

  return client;
};

const createTables = async (client: Client) => {
  client
    .execute(
      `
    CREATE TABLE sessions (
      uid text primary key,
      token text,
      created_at integer
    )
  `
    )
    .then(() => logger.info("Created table 'sessions'"))
    .catch(() => logger.info("Table 'sessions' already exists"));

  client
    .execute(
      `
    CREATE TABLE users (
      uid text primary key,
      username text unique,
      password text,
      created_at integer
    )
  `
    )
    .then(() => logger.info("Created table 'users'"))
    .catch(() => logger.info("Table 'users' already exists"));
};

const createTestUser = async (client: Client) => {
  await client.execute(
    'DELETE FROM users WHERE uid = "6dd1d810-0f8a-459c-b994-6973f5c967ca"'
  );
  await client.execute(
    `INSERT INTO users (uid, username, password, created_at) VALUES ("6dd1d810-0f8a-459c-b994-6973f5c967ca", "Test", "test123", ${new Date().getUTCSeconds()})`
  );
  logger.info("Created test user");
};
