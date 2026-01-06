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
    // Сортируем ошибки по порядку: websiteUrl, name, description
    const fieldOrder = ["websiteUrl", "name", "description"];
    const sortedErrors = errors.sort((a, b) => {
      const indexA = fieldOrder.indexOf(a.field);
      const indexB = fieldOrder.indexOf(b.field);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return res
      .status(HTTP_STATUSES.BAD_REQUEST)
      .send({ errorsMessages: sortedErrors });
  }

  next();
};
