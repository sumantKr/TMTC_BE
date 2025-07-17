import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ErrorResponse from "../common/ErrorResponse";
import { StatusCodes } from "http-status-codes";
import { COOKIE_NAME } from "../constants/constants";
import { IUserRequest } from "../common/request.types";
import { IUserTokenPayload } from "../controllers/authentication/authentication.types";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export function authMiddleware(
  req: IUserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      throw new ErrorResponse({
        status: StatusCodes.UNAUTHORIZED,
        message: "Authentication token missing",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as IUserTokenPayload;

    req.user = decoded;
    next();
  } catch (err) {
    next(
      new ErrorResponse({
        status: StatusCodes.UNAUTHORIZED,
        message: "Invalid or expired authentication token",
      })
    );
  }
}
