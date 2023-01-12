import Controller from "./Controller";
import usersTableController from "../db/usersTable/controller";
import { catchAsync } from "../utils/catchAsync";
import { RequestHandler } from "express";
import hash from "object-hash";
import { signAccessToken } from "../utils/jwt";

class LoginUserController extends Controller {
  public readonly path: string;

  public constructor(
    path: string,
    public readonly usersTable: usersTableController
  ) {
    super("");
    this.path = path;
    this.initializeRoutes();
  }

  public initializeRoutes = () => {
    this.router.post("/", catchAsync(this.loginUser));
  };

  public loginUser: RequestHandler = async (req, res) => {
    if (!req.body.login || !req.body.password) {
      res.status(400).send({
        message: "Request body is not as expected",
      });
    }

    const login = req.body.login;
    const password = req.body.password;

    if (!(await this.usersTable.checkIfLoginExists(login))) {
      return res.status(200).send({
        message: "Login does not exist",
      });
    }
    if (
      !(await this.usersTable.checkIfPasswordCorrect(login, hash(password)))
    ) {
      return res.status(200).send({
        message: "Password is not correct",
      });
    }

    const uuid = await this.usersTable.getUUIDbyLogin(login);

    return res.status(200).send({
      message: "User is logged in",
      token: signAccessToken(uuid),
    });
  };
}

export default LoginUserController;
