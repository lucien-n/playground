import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const users = sqliteTable("users", {
  uid: text("uid").notNull().default(uuid()),
  username: text("username").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .default(new Date().getUTCSeconds()),
});
