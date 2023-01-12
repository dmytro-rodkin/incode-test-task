import { pgTable, text, serial } from "drizzle-orm-pg";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: text("uuid"),
  name: text("name"),
  login: text("login"),
  password: text("password"),
  status: text("status"),
  bossUuid: text("boss_uuid"),
});
