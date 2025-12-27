import { Router } from "express";

import { superAdminGuardMiddleware } from "../../core/middlewares/authMiddlware";
import { idValidation } from "../../core/validations/core.validations";
import { errorValidationMiddleware } from "../../core/middlewares/errorAccMiddleware";
import { postsController } from "../controllers/posts.controller";
import { getPostHandler } from "../handlers/getPostsHandler";
import { createPostValidation } from "../validations/posts.validations";
import { createPostHandler } from "../handlers/createPostsHandler";

export const postsRouter = Router();

postsRouter.get("/", postsController.getPosts);
postsRouter.get(
  "/:id",
  idValidation(1, 1000),
  errorValidationMiddleware,
  getPostHandler
);
postsRouter.post(
  "/",
  superAdminGuardMiddleware,
  createPostValidation,
  errorValidationMiddleware,
  postsController.createPost
);
postsRouter.put(
  "/:id",
  superAdminGuardMiddleware,
  idValidation(1, 1000),
  createPostValidation,
  errorValidationMiddleware,
  postsController.updatePost
);
postsRouter.delete(
  "/:id",
  superAdminGuardMiddleware,
  idValidation(1, 1000),
  errorValidationMiddleware,
  postsController.deletePost
);
