import { Router } from "express";
import { blogsController } from "../controllers/blogs.controller";
import { errorValidationMiddleware } from "../middlewares/blogs.middlewares";
import {
  idValidation,
  createBlogValidation,
} from "../validations/blogs.validations";
import { superAdminGuardMiddleware } from "../../core/middlewares/authMiddlware";
import { paginationAndSortingValidation } from "../../core/validations/core.validations";

export const blogsRouter = Router();

blogsRouter.get(
  "/",
  () =>
    paginationAndSortingValidation({
      name: "name",
      description: "description",
      websiteUrl: "websiteUrl",
      createdAt: "createdAt",
      isMembership: "isMembership",
    }),
  blogsController.getBlogs
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
