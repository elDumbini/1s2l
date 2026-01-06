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
    const bodyFields = ["shortDescription", "title", "content", "blogId", "name", "description", "websiteUrl"];
    const hasBodyErrors = errors.some((error) => bodyFields.includes(error.field));
    
    if (hasBodyErrors) {
      const bodyErrors = errors.filter((error) => error.field !== "id");
      const fieldOrder = ["shortDescription", "title", "content", "blogId"];
      
      bodyErrors.sort((a, b) => {
        const indexA = fieldOrder.indexOf(a.field);
        const indexB = fieldOrder.indexOf(b.field);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      });

      return res
        .status(HTTP_STATUSES.BAD_REQUEST)
        .send({ errorsMessages: bodyErrors });
    }

    return res
      .status(HTTP_STATUSES.BAD_REQUEST)
      .send({ errorsMessages: errors });
  }

  next();
};
