import express from "express";
import type { Express, NextFunction, Request, Response } from "express";
import { blogCollection, postCollection } from "./db/mongodb";
import { HTTP_STATUSES, ROUTES } from "./core/types/types";
import { blogsRouter } from "./blogs/routes/blogs.router";
import { postsRouter } from "./posts/routes/posts.routes";
import { AppError } from "./core/utils/errorsInstances";

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).send();
  });
  app.delete(ROUTES.TESTING_ALL_DATA, async (req, res) => {
    await blogCollection.deleteMany({});
    await postCollection.deleteMany({});
    res.status(204).send();
  });
  app.use(ROUTES.BLOGS, blogsRouter);
  app.use(ROUTES.POSTS, postsRouter);

  app.use((req: Request, res: Response) => {
    res.status(HTTP_STATUSES.NOT_FOUND).send();
  });
  app.use(
    (
      err: Error | AppError,
      req: Request,
      res: Response,
    ) => {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          errorsMessages: err.field
            ? [{ field: err.field, message: err.message }]
            : [{ message: err.message }],
        });
      }

      console.error("Unhandled error:", err);
      return res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR).json({
        errorsMessages: [{ message: "Internal server error" }],
      });
    }
  );
  return app;
};
