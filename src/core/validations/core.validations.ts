import { param } from "express-validator";

export const idValidation = (mix = 1, max = 1000) =>
  param("id")
    .exists()
    .withMessage("ID is required")
    .isString()
    .withMessage("ID must be a string")
    .isLength({ min: mix, max: max })
    .withMessage("ID must be between 1 and 1000 characters")
    .isNumeric()
    .withMessage("ID must be a numeric string");
