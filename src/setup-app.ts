import express from "express";
import type { Express } from "express";
import { db } from "./db/db";
import { ROUTES } from "./core/types/types";
import { blogsRouter } from "./blogs/routes/blogs.router";
import { postsRouter } from "./posts/routes/posts.routes";

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.get("/", (req, res) => {
    res.status(200).send({ message: "Hello World" });
  });
  app.use(ROUTES.TESTING_ALL_DATA, (req, res) => {
    db.blogs = [];
    db.posts = [];
    res.status(204).send();
  });
  app.use(ROUTES.BLOGS, blogsRouter);
  app.use(ROUTES.POSTS, postsRouter);
  return app;
};
