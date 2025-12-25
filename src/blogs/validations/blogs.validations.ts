import { body, param } from "express-validator";
import { isUrlValid } from "../../core/constants/regConstants";

export const idValidation = param("id")
  .exists()
  .withMessage("ID is required")
  .isString()
  .withMessage("ID must be a string")
  .isLength({ min: 1, max: 1000 })
  .withMessage("ID must be between 1 and 1000 characters")
  .isNumeric()
  .withMessage("ID must be a numeric string");

// create blog validation - объединенные валидации в массиве
export const createBlogValidation = [
  body("name")
    .exists()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 1, max: 15 })
    .withMessage("Name must be between 1 and 15 characters"),

  body("description")
    .exists()
    .withMessage("Description needed")
    .isString()
    .withMessage("Description must be a string")
    .isLength({ min: 1, max: 500 })
    .withMessage("Description must be between 1 and 500 characters"),

  body("websiteUrl")
    .exists()
    .withMessage("Website URL needed")
    .isString()
    .withMessage("Website URL must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Website URL must be between 1 and 100 characters")
    .isURL({ protocols: ["https"] })
    .withMessage("Website URL must be a valid HTTPS URL"),
  ];

  // для обновления 