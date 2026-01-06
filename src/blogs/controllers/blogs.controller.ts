import { Request, Response } from "express";
import { CreateBlogDTO, GetBlogsDTO } from "../dto/blogs.dto";
import { blogsRepository } from "../repositories/blogs.repositories";
import { ClientError, HTTP_STATUSES } from "../../core/types/types";
import { BlogItem } from "../types/types";
import { blogsService } from "../services/blogs.services";

export const blogsController = {
  getBlogs: (_: any, res: Response<GetBlogsDTO>) => {
    return res.status(HTTP_STATUSES.OK).send(blogsService.getBlogs());
  },
  getBlogById: (req: Request, res: Response<BlogItem | ClientError>) => {
    const blog = blogsService.getBlogById(req.params.id || "");
    if (!blog) {
      return res.status(HTTP_STATUSES.NOT_FOUND).send({
        errorsMessages: [{ field: "id", message: "Blog not found" }],
      });
    }
    return res.status(HTTP_STATUSES.OK).send(blog);
  },
  createBlog: (
    req: Request<{}, {}, CreateBlogDTO>,
    res: Response<BlogItem | ClientError>
  ) => {
    const newBlog = blogsService.createBlog(req.body);
    return res.status(HTTP_STATUSES.CREATED).send(newBlog);
  },
  updateBlog: (
    req: Request<{ id: string }, {}, CreateBlogDTO>,
    res: Response<BlogItem | ClientError>
  ) => {
    const updatedBlog = blogsService.updateBlog(req.params.id, req.body);
    if (!updatedBlog) {
      return res.status(HTTP_STATUSES.NOT_FOUND).send({
        errorsMessages: [{ field: "id", message: "Blog not found" }],
      });
    }
    return res.status(HTTP_STATUSES.NO_CONTENT).send(updatedBlog);
  },
  deleteBlog: (
    req: Request<{ id: string }>,
    res: Response<boolean | ClientError>
  ) => {
    const deletedBlog = blogsService.deleteBlog(req.params.id);
    if (!deletedBlog) {
      return res.status(HTTP_STATUSES.NOT_FOUND).send({
        errorsMessages: [{ field: "id", message: "Blog not found" }],
      });
    }
    return res.status(HTTP_STATUSES.NO_CONTENT).send(deletedBlog);
  },
};
