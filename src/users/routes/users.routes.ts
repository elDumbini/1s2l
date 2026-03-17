import { Router } from "express";

import { superAdminGuardMiddleware } from "../../core/middlewares/authMiddlware";
import { errorValidationMiddleware } from "../../core/middlewares/errorAccMiddleware";

import {
  idValidation,
  paginationAndSortingValidation,
} from "../../core/validations/core.validations";
import { userController } from "../controllers/users.controller";
import { createUserValidation } from "../validations/users.validations";

export const usersRouter = Router();

usersRouter.get(
  "/",
  paginationAndSortingValidation({
    searchEmailTerm: "searchEmailTerm",
    searchLoginTerm: "searchLoginTerm",
  }),
  errorValidationMiddleware,
  userController.getUsers
);

usersRouter.post(
  "/",
  superAdminGuardMiddleware,
  createUserValidation,
  errorValidationMiddleware,
  userController.createUser
);
usersRouter.delete(
  "/:id",
  superAdminGuardMiddleware,
  idValidation(1, 1000),
  errorValidationMiddleware,
  userController.deleteUser
);
