import { InferModel, PgDatabase } from "drizzle-orm-pg";
import { subordinatesTable } from "./schema.js";
import { and, asc, desc, eq, or } from "drizzle-orm/expressions";
import { userData } from "../../dtos/interfaces";

export default class subordinatesTableController {
  public constructor(private db: PgDatabase) {}

  public addSubordinateToUuid = async (
    uuid: string,
    subuuid: string
  ): Promise<void> => {
    let dataFromRow = await this.db
      .select(subordinatesTable)
      .where(eq(subordinatesTable.uuid, uuid));
    if (dataFromRow.length == 0) {
      await this.addRow(uuid);
      dataFromRow = await this.db
        .select(subordinatesTable)
        .where(eq(subordinatesTable.uuid, uuid));
    }
    await this.db
      .update(subordinatesTable)
      .set({
        subsuuid: dataFromRow[0].subsuuid?.concat(subuuid),
      })
      .where(eq(subordinatesTable.uuid, uuid));
  };

  private addRow = async (uuid: string) => {
    await this.db.insert(subordinatesTable).values({
      uuid,
      subsuuid: [],
    });
  };

  public checkifUserHaveSubs = async (uuid: string): Promise<boolean> => {
    let dataFromRow = await this.db
      .select(subordinatesTable)
      .where(eq(subordinatesTable.uuid, uuid));
    return dataFromRow.length !== 0;
  };

  public getAllSubsOfUser = async (uuid: string): Promise<string[]> => {
    let dataFromRow = await this.db
      .select(subordinatesTable)
      .where(eq(subordinatesTable.uuid, uuid));
    return dataFromRow[0].subsuuid!;
  };

  public switchBossOfUser = async (
    useruuid: string,
    oldbossuuid: string,
    newbossuuid: string
  ) => {
    let dataFromRow = await this.db
      .select(subordinatesTable)
      .where(eq(subordinatesTable.uuid, oldbossuuid));

    const newSubsuuid = dataFromRow[0].subsuuid!.filter((elem) => {
      return elem !== useruuid;
    });

    await this.db
      .update(subordinatesTable)
      .set({
        subsuuid: newSubsuuid,
      })
      .where(eq(subordinatesTable.uuid, oldbossuuid));

    await this.addSubordinateToUuid(newbossuuid, useruuid);
  };
}
