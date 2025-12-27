import { body } from "express-validator";

export const createPostValidation = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 1, max: 30 })
    .withMessage("Title must be between 1 and 30 characters"),

  body("shortDescription")
    .exists()
    .withMessage("Short description needed")
    .isString()
    .withMessage("Short description must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Short description must be between 1 and 100 characters"),

  body("content")
    .exists()
    .withMessage("Content needed")
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content must be between 1 and 1000 characters"),

  body("blogId")
    .exists()
    .withMessage("Blog ID needed")
    .isString()
    .withMessage("Blog ID must be a string")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Blog ID must be between 1 and 100 characters"),
];
