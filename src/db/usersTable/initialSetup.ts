// import { pool } from "../connection";
import pg from "pg";
import { usersTable } from "./schema.js";
import { PgDatabase } from "drizzle-orm-pg";
import { and, asc, desc, eq, or } from "drizzle-orm/expressions";
import { v4 as uuidv4 } from "uuid";
import hash from "object-hash";

export const createUsersTableIfNotExists = async (pool: pg.Pool) => {
  const createTableTemplate = `
      CREATE TABLE IF NOT EXISTS users (
        "id" SERIAL,
        "uuid" TEXT,
        "name" TEXT,
        "login" TEXT,
        "password" TEXT,
        "status" TEXT,
        "boss_uuid" TEXT,
        PRIMARY KEY ("id")
    );`;
  await pool.query(createTableTemplate);
};

export const addAdminIfNotExists = async (pool: pg.Pool, db: PgDatabase) => {
  const adminRow = await db
    .select(usersTable)
    .where(eq(usersTable.status, "Admin"));
  if (adminRow.length == 0) {
    await db.insert(usersTable).values({
      uuid: uuidv4(),
      name: process.env.NAME_ADMIN,
      login: process.env.LOGIN_ADMIN,
      password: hash(process.env.PASSWORD_ADMIN),
      status: "Admin",
      bossUuid: "-",
    });
    console.log("Admin added");
  } else console.log("Admin existed");
};
