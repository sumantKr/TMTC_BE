import { Request } from "express";
import { IUserTokenPayload } from "../controllers/authentication/authentication.types";

export interface IUserRequest<
  P = Record<string, any>, // Params
  ResBody = any, // Response Body
  ReqBody = any, // Request Body
  ReqQuery = Record<string, any> // Query Params
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: IUserTokenPayload;
}
