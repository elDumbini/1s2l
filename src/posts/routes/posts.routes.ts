import { Router } from "express";

import { superAdminGuardMiddleware } from "../../core/middlewares/authMiddlware";
import { errorValidationMiddleware } from "../../core/middlewares/errorAccMiddleware";
import { postsController } from "../controllers/posts.controller";
import { getPostHandler } from "../handlers/getPostsHandler";
import {
  createPostValidation,
  idValidation,
} from "../validations/posts.validations";
import { createPostHandler } from "../handlers/createPostsHandler";
import { paginationAndSortingValidation } from "../../core/validations/core.validations";

export const postsRouter = Router();

postsRouter.get(
  "/",
  paginationAndSortingValidation({
    title: "title",
    shortDescription: "shortDescription",
    content: "content",
    blogId: "blogId",
    createdAt: "createdAt",
  }),
  errorValidationMiddleware,
  postsController.getPosts
);
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
