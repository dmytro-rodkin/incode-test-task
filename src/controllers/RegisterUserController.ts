import Controller from "./Controller";
import usersTableController from "../db/usersTable/controller";
import subordibanesTableController from "../db/subordinatesTable/controller";

import { catchAsync } from "../utils/catchAsync";
import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import hash from "object-hash";
import {
  PasswordVerification,
  LoginVerification,
} from "../utils/RegisterLoginVerification";

class RegisterUserController extends Controller {
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
    this.router.post("/", catchAsync(this.registerUser));
  };

  public registerUser: RequestHandler = async (req, res) => {
    if (
      !req.body.name ||
      !req.body.login ||
      !req.body.password ||
      !req.body.status ||
      !req.body.bossUuid
    ) {
      // console.log(req.body);

      return res.status(400).send({
        message: "Request body is not as expected",
      });
    }

    const status = req.body.status;
    const name = req.body.name;
    const login = req.body.login;
    const password = req.body.password;
    const bossUuid = req.body.bossUuid;

    if (!PasswordVerification(password)) {
      return res.status(400).send({
        message:
          "Password should be longer than 8 letters, contain a symbol, a number and a letter",
      });
    }
    if (!LoginVerification(login)) {
      return res.status(400).send({
        message: "Login should be longer than 8 letters",
      });
    }

    if (await this.usersTable.checkIfLoginExists(login)) {
      return res.status(200).send({
        message: "Login already exists",
      });
    }

    if (!(await this.usersTable.checkIfUserIsBossAdmin(bossUuid))) {
      return res.status(200).send({
        message: "Invalid boss uuid",
      });
    }
    const uuid = uuidv4();
    await this.usersTable.registerUser(
      uuid,
      name,
      login,
      hash(password),
      status,
      bossUuid
    );
    await this.subordinatesTable.addSubordinateToUuid(bossUuid, uuid);

    return res.status(200).send({
      message: "User registered",
    });
  };
}

export default RegisterUserController;
