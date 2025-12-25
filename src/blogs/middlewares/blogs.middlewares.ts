import { param } from "express-validator";
import { validationResult, ValidationError } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUSES } from "../../core/types/types";

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
