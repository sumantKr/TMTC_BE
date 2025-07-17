import { IUser } from "../user/user.types";

export interface IUserTokenPayload extends Omit<IUser, "password"> {
  iat: number;
  exp: number;
}
