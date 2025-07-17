import { plainToClassFromExist } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import ErrorResponse from "../common/ErrorResponse";

function validationMiddleware(
  type: any,
  source: "body" | "query" | "params" = "body",
  skipMissingProperties = false
): RequestHandler {
  return (req, res, next) => {
    validate(plainToClassFromExist(new type(), req[source]), {
      skipMissingProperties,
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) => JSON.stringify(error.constraints))
          .join(", ");
        next(new ErrorResponse({ status: StatusCodes.BAD_REQUEST, message }));
      } else {
        next();
      }
    });
  };
}

export default validationMiddleware;
