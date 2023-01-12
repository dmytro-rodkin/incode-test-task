// import { pool } from "../connection";
import pg from "pg";

export const createSubordinatesTableIfNotExists = async (pool: pg.Pool) => {
  const createTableTemplate = `
      CREATE TABLE IF NOT EXISTS subordinates (
        "id" SERIAL,
        "uuid" TEXT,
        "subsuuid" JSON,
        PRIMARY KEY ("id")
    );`;
  await pool.query(createTableTemplate);
};
