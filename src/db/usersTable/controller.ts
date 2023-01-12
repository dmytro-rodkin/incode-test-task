import { InferModel, PgDatabase } from "drizzle-orm-pg";
import { usersTable } from "./schema.js";
import { and, asc, desc, eq, or } from "drizzle-orm/expressions";
import { userData } from "../../dtos/interfaces";

export default class usersTableController {
  public constructor(private db: PgDatabase) {}

  public registerUser = async (
    uuid: string,
    name: string,
    login: string,
    password: string,
    status: string,
    bossUuid: string
  ): Promise<void> => {
    await this.db.insert(usersTable).values({
      uuid,
      name,
      login,
      password,
      status,
      bossUuid,
    });
  };

  public checkIfLoginExists = async (login: string): Promise<boolean> => {
    let dataFromRow = await this.db
      .select(usersTable)
      .where(eq(usersTable.login, login));
    if (dataFromRow.length != 0) {
      return true;
    } else return false;
  };

  public checkIfPasswordCorrect = async (
    login: string,
    password: string
  ): Promise<boolean> => {
    let dataFromRow = await this.db
      .select(usersTable)
      .where(eq(usersTable.login, login));
    if (dataFromRow.length != 0 && dataFromRow[0].password === password) {
      return true;
    } else return false;
  };

  public checkIfUserIsBossAdmin = async (uuid: string): Promise<boolean> => {
    let dataFromRow = await this.db
      .select(usersTable)
      .where(eq(usersTable.uuid, uuid));
    if (dataFromRow.length != 0 && dataFromRow[0].status !== "Regular") {
      return true;
    } else return false;
  };

  public getUUIDbyLogin = async (login: string): Promise<string> => {
    let dataFromRow = await this.db
      .select(usersTable)
      .where(eq(usersTable.login, login));
    if (dataFromRow[0].uuid != null) {
      return dataFromRow[0].uuid;
    } else return "";
  };

  public getStatusByUUID = async (uuid: string): Promise<string> => {
    let dataFromRow = await this.db
      .select(usersTable)
      .where(eq(usersTable.uuid, uuid));

    return dataFromRow[0].status!;
  };

  public getUserInfo = async (uuid: string): Promise<userData> => {
    let dataFromRow = await this.db
      .select(usersTable)
      .where(eq(usersTable.uuid, uuid));
    return {
      uuid: uuid,
      name: dataFromRow[0].name!,
      status: dataFromRow[0].status!,
      bossuuid: dataFromRow[0].bossUuid!,
    };
  };
  public getAllUsersUUID = async (): Promise<string[]> => {
    let dataFromRow = await this.db.select(usersTable);
    const allUsersUUID = dataFromRow.map((elem) => elem.uuid!);
    return allUsersUUID;
  };

  public changeUserBoss = async (userUUID: string, newbossUUID: string) => {
    await this.db
      .update(usersTable)
      .set({
        bossUuid: newbossUUID,
      })
      .where(eq(usersTable.uuid, userUUID));
  };

  public checkIfUserExists = async (uuid: string): Promise<Boolean> => {
    let dataFromRow = await this.db
      .select(usersTable)
      .where(eq(usersTable.uuid, uuid));
    if (dataFromRow.length != 0) {
      return true;
    } else {
      return false;
    }
  };
}
