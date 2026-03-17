import { body } from "express-validator";

export const createUserValidation = [
  body("login")
    .exists()
    .isString()
    .withMessage("login must be a string")
    .isLength({ min: 3, max: 10 })
    .withMessage("login must be between 3 and 10 characters")
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage(
      "login must contain only letters, numbers, underscores, and hyphens"
    ),
  body("email")
    .exists()
    .withMessage("email is required")
    .isString()
    .withMessage("email must be a string")
    .customSanitizer((value) => {
      return typeof value === "string" ? value.trim() : value;
    })
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    .withMessage("email must be a valid email address"),

  body("password")
    .exists()
    .withMessage("Content needed")
    .isString()
    .withMessage("Content must be a string")
    .customSanitizer((value) => {
      return typeof value === "string" ? value.trim() : value;
    })
    .isLength({ min: 6, max: 20 })
    .withMessage("password must be between 6 and 20 characters"),
];
