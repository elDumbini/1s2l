import { Router } from "express";
import { blogsController } from "../controllers/blogs.controller";
import { errorValidationMiddleware } from "../middlewares/blogs.middlewares";
import {
  idValidation,
  createBlogValidation,
} from "../validations/blogs.validations";

export const blogsRouter = Router();

blogsRouter.get("/", blogsController.getBlogs);
blogsRouter.get(
  "/:id",
  idValidation,
  errorValidationMiddleware,
  blogsController.getBlogById
);
blogsRouter.post(
  "/",
  createBlogValidation,
  errorValidationMiddleware,
  blogsController.createBlog
);
blogsRouter.put(
  "/:id",
  idValidation,
  createBlogValidation,
  errorValidationMiddleware,
  blogsController.updateBlog
);