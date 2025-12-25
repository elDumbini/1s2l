import express from "express";
import type { Express } from "express";
import { db } from "./db/db";
import { ROUTES } from "./core/types/types";
import { blogsRouter } from "./blogs/routes/blogs.router";

export const setupApp = (app: Express) => {
  app.use(express.json());
  app.get("/", (req, res) => {
    res.status(200).send("Hello world!");
  });
  app.use(ROUTES.TESTING_ALL_DATA, (req, res) => {
    db.blogs = [];
    res.status(204).send("All data deleted");
  });
  app.use(ROUTES.BLOGS, blogsRouter);
  return app;
};
