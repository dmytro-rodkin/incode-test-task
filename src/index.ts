import App from "./App";
import * as dotenv from "dotenv";
dotenv.config();

import { PgDatabase } from "drizzle-orm-pg";
import { pool } from "./db/connection";
import { drizzle } from "drizzle-orm-pg/node";

import usersTableController from "./db/usersTable/controller";
import subordibanesTableController from "./db/subordinatesTable/controller";

import RegisterUserController from "./controllers/RegisterUserController";
import LoginUserController from "./controllers/LoginUserController";
import ListSubsController from "./controllers/ListSubsController";
import ChangeBossController from "./controllers/ChangeBossController";
import {
  createUsersTableIfNotExists,
  addAdminIfNotExists,
} from "./db/usersTable/initialSetup";
import { createSubordinatesTableIfNotExists } from "./db/subordinatesTable/initialSetup";

const main = async () => {
  await pool.connect();
  const client: PgDatabase = drizzle(pool);

  await createUsersTableIfNotExists(pool);
  await addAdminIfNotExists(pool, client);
  await createSubordinatesTableIfNotExists(pool);

  const port = process.env.PORT_APP || 3000;
  const controllers = [
    new RegisterUserController(
      "/register",
      new usersTableController(client),
      new subordibanesTableController(client)
    ),
    new LoginUserController("/login", new usersTableController(client)),
    new ListSubsController(
      "/list",
      new usersTableController(client),
      new subordibanesTableController(client)
    ),
    new ChangeBossController(
      "/change-boss",
      new usersTableController(client),
      new subordibanesTableController(client)
    ),
  ];
  const app = new App(controllers, port);

  app.listen();
};

main();
