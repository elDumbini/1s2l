import { Request, Response } from "express";
import { CreateBlogDTO, GetBlogsDTO } from "../dto/blogs.dto";
import { blogsRepository } from "../repositories/blogs.repositories";
import { ClientError, HTTP_STATUSES } from "../../core/types/types";
import { BlogItem } from "../types/types";
import { blogsService } from "../services/blogs.services";

export const blogsController = {
  getBlogs: async (_: any, res: Response<GetBlogsDTO>) => {
    const blogs = await blogsService.getBlogs();
    return res.status(HTTP_STATUSES.OK).send(blogs);
  },
  getBlogById: async (
    req: Request,
    res: Response<BlogItem | ClientError>
  ) => {
    const blog = await blogsService.getBlogById(req.params.id || "");
    if (!blog) {
      return res.status(HTTP_STATUSES.NOT_FOUND).send({
        errorsMessages: [{ field: "id", message: "Blog not found" }],
      });
    }
    return res.status(HTTP_STATUSES.OK).send(blog);
  },
  createBlog: async (
    req: Request<{}, {}, CreateBlogDTO>,
    res: Response<BlogItem | ClientError>
  ) => {
    const newBlog = await blogsService.createBlog(req.body);
    return res.status(HTTP_STATUSES.CREATED).send(newBlog);
  },
  updateBlog: async (
    req: Request<{ id: string }, {}, CreateBlogDTO>,
    res: Response<BlogItem | ClientError>
  ) => {
    const updatedBlog = await blogsService.updateBlog(
      req.params.id,
      req.body
    );
    if (!updatedBlog) {
      return res.status(HTTP_STATUSES.NOT_FOUND).send({
        errorsMessages: [{ field: "id", message: "Blog not found" }],
      });
    }
    return res.status(HTTP_STATUSES.NO_CONTENT).send(updatedBlog);
  },
  deleteBlog: async (
    req: Request<{ id: string }>,
    res: Response<boolean | ClientError>
  ) => {
    const deletedBlog = await blogsService.deleteBlog(req.params.id);
    if (!deletedBlog) {
      return res.status(HTTP_STATUSES.NOT_FOUND).send({
        errorsMessages: [{ field: "id", message: "Blog not found" }],
      });
    }
    return res.status(HTTP_STATUSES.NO_CONTENT).send(deletedBlog);
  },
};
