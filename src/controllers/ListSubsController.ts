import Controller from "./Controller";
import usersTableController from "../db/usersTable/controller";
import { catchAsync } from "../utils/catchAsync";
import { Response } from "express";
import { authMiddleware } from "../utils/authMiddleware";
import { CustomRequest, userData } from "../dtos/interfaces";
import subordibanesTableController from "../db/subordinatesTable/controller";

class ListSubsController extends Controller {
  public readonly path: string;

  public constructor(
    path: string,
    public readonly usersTable: usersTableController,
    public readonly subordinatesTable: subordibanesTableController
  ) {
    super("");
    this.path = path;
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.get("/", authMiddleware, catchAsync(this.listSubs));
  };

  public listSubs = async (req: CustomRequest, res: Response) => {
    const uuid = req.uuid!;
    const status = await this.usersTable.getStatusByUUID(uuid);
    let subsInfo: userData[] = [];

    switch (status) {
      case "Admin":
        const allUsersUuid = await this.usersTable.getAllUsersUUID();

        for (const user of allUsersUuid) {
          subsInfo = subsInfo.concat(await this.usersTable.getUserInfo(user));
        }
        break;
      case "Boss":
        const subs = await this.getSubs(uuid);

        for (const sub of subs) {
          subsInfo = subsInfo.concat(await this.usersTable.getUserInfo(sub));
        }
        break;
      case "Regular":
        subsInfo = [await this.usersTable.getUserInfo(uuid)];
        break;
      default:
        break;
    }

    res.status(200).send({
      message: subsInfo,
    });
  };

  private getSubs = async (uuid: string) => {
    let value: string[] = [];
    if (await this.subordinatesTable.checkifUserHaveSubs(uuid)) {
      const subsArray = await this.subordinatesTable.getAllSubsOfUser(uuid);
      for (const sub of subsArray) {
        const out = await this.getSubs(sub);
        value = value.concat(out);
      }
    }
    return [uuid, ...value];
  };
}

export default ListSubsController;
