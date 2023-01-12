import Controller from "./Controller";
import usersTableController from "../db/usersTable/controller";
import { catchAsync } from "../utils/catchAsync";
import { Response } from "express";
import { authMiddleware } from "../utils/authMiddleware";
import { CustomRequest, userData } from "../dtos/interfaces";
import subordibanesTableController from "../db/subordinatesTable/controller";

class ChangeBossController extends Controller {
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
    this.router.put("/", authMiddleware, catchAsync(this.changeBoss));
  };

  public changeBoss = async (req: CustomRequest, res: Response) => {
    const bossuuid = req.uuid!;

    if (!req.body.uuid || !req.body.newbossuuid) {
      return res.status(400).send({
        message: "Request body is not as expected",
      });
    }

    const subUUID = req.body.uuid!;
    const newbossUUID = req.body.newbossuuid!;

    if (
      !(await this.usersTable.checkIfUserExists(subUUID)) ||
      !(await this.usersTable.checkIfUserExists(newbossUUID))
    ) {
      return res.status(400).send({
        message: "Invalid uuid  ",
      });
    }

    if ((await this.usersTable.getUserInfo(subUUID)).bossuuid != bossuuid) {
      return res.status(400).send({
        message: "Unauthorized",
      });
    }
    if ((await this.usersTable.getUserInfo(newbossUUID)).status == "Regular") {
      return res.status(400).send({
        message: "New boss is a regular user",
      });
    }

    await this.usersTable.changeUserBoss(subUUID, newbossUUID);
    await this.subordinatesTable.switchBossOfUser(
      subUUID,
      bossuuid,
      newbossUUID
    );

    res.status(200).send({
      message: "Boss changed",
    });
  };
}

export default ChangeBossController;
