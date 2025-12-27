import { NextFunction, Request, Response } from "express";
import { ValidationError, validationResult } from "express-validator";
import { HTTP_STATUSES } from "../types/types";

const formatErrors = (error: ValidationError) => ({
  field: error.type === "field" ? error.path : error.type,
  message: error.msg,
});

export const errorValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length) {
    return res
      .status(HTTP_STATUSES.BAD_REQUEST)
      .send({ errorMessages: errors });
  }

  next();
};
