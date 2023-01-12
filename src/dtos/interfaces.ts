import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
  uuid?: string;
}

export interface CustomJwtPayload extends JwtPayload {
  uuid: string;
}

export interface userData {
  uuid: string;
  name: string;
  status: string;
  bossuuid: string;
}
