import jsonwebtoken, { VerifyErrors } from "jsonwebtoken";
import { RequestHandler, Response, NextFunction } from "express";
import { CustomJwtPayload, CustomRequest } from "../dtos/interfaces";

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers["authorization"]!.split(" ")[1];
    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw Error();
      } else if (decoded) {
        // console.log(decoded);
        req.uuid = (decoded as CustomJwtPayload).uuid;
      }
    });
    next();
  } catch (err) {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
};
