import { Router } from "express";
import { blogsController } from "../controllers/blogs.controller";
import { errorValidationMiddleware } from "../middlewares/blogs.middlewares";
import {
  idValidation,
  createBlogValidation,
} from "../validations/blogs.validations";
import { superAdminGuardMiddleware } from "../../core/middlewares/authMiddlware";
import { paginationAndSortingValidation } from "../../core/validations/core.validations";
import { createPostForBlogValidation } from "../../posts/validations/posts.validations";
import { errorValidationMiddleware as postsErrorValidationMiddleware } from "../../core/middlewares/errorAccMiddleware";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  paginationAndSortingValidation({
    createdAt: "createdAt",
  }),
  errorValidationMiddleware,
  blogsController.getBlogs
);
blogsRouter.get(
  "/:id/posts",
  idValidation,
  paginationAndSortingValidation({
    title: "title",
    shortDescription: "shortDescription",
    content: "content",
    blogId: "blogId",
    createdAt: "createdAt",
  }),
  errorValidationMiddleware,
  blogsController.getBlogPosts
);
blogsRouter.post(
  "/:id/posts",
  superAdminGuardMiddleware,
  idValidation,
  createPostForBlogValidation,
  postsErrorValidationMiddleware,
  blogsController.createPostForBlog
);
blogsRouter.get(
  "/:id",
  idValidation,
  errorValidationMiddleware,
  blogsController.getBlogById
);
blogsRouter.post(
  "/",
  superAdminGuardMiddleware,
  createBlogValidation,
  errorValidationMiddleware,
  blogsController.createBlog
);
blogsRouter.put(
  "/:id",
  superAdminGuardMiddleware,
  idValidation,
  createBlogValidation,
  errorValidationMiddleware,
  blogsController.updateBlog
);
blogsRouter.delete(
  "/:id",
  superAdminGuardMiddleware,
  idValidation,
  errorValidationMiddleware,
  blogsController.deleteBlog
);
