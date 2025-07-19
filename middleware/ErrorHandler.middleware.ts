import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../common/ErrorResponse";

function errorMiddleware(
  error: ErrorResponse,
  request: Request,
  response: Response,
  next: NextFunction
) {
  return response.status(error.status).send({
    ...error,
    message:error.message
  });
}

export default errorMiddleware;
