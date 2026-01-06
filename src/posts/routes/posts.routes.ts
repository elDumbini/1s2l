import { Router } from "express";

import { superAdminGuardMiddleware } from "../../core/middlewares/authMiddlware";
import { errorValidationMiddleware } from "../../core/middlewares/errorAccMiddleware";
import { postsController } from "../controllers/posts.controller";
import { getPostHandler } from "../handlers/getPostsHandler";
import { createPostValidation, idValidation } from "../validations/posts.validations";
import { createPostHandler } from "../handlers/createPostsHandler";

export const postsRouter = Router();

postsRouter.get("/", postsController.getPosts);
postsRouter.get(
  "/:id",
  idValidation,
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
  idValidation,
  createPostValidation,
  errorValidationMiddleware,
  postsController.updatePost
);
postsRouter.delete(
  "/:id",
  superAdminGuardMiddleware,
  idValidation,
  errorValidationMiddleware,
  postsController.deletePost
);
