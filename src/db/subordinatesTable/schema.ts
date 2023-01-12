import { pgTable, text, json, serial } from "drizzle-orm-pg";

export const subordinatesTable = pgTable("subordinates", {
  id: serial("id").primaryKey(),
  uuid: text("uuid"),
  subsuuid: json<string[]>("subsuuid"),
});
