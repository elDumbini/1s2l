import { Request, Response, NextFunction } from "express";
import { CreateBlogDTO, GetBlogsDTO } from "../dto/blogs.dto";
import { blogsRepository } from "../repositories/blogs.repositories";
import { ClientError, HTTP_STATUSES } from "../../core/types/types";
import { BlogItem, GetBlogsQuery } from "../types/types";
import { blogsService } from "../services/blogs.services";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
} from "../../core/validations/core.validations";
import { postsService } from "../../posts/services/posts.services";
import { PostItem } from "../../posts/types/posts";
import { CreatePostDTO } from "../../posts/dto/posts.dto";

export const blogsController = {
  getBlogs: async (
    req: Request<{}, {}, {}, GetBlogsQuery>,
    res: Response<GetBlogsDTO>,
    next: NextFunction
  ) => {
    try {
      const {
        pageNumber = DEFAULT_PAGE,
        pageSize = DEFAULT_PAGE_SIZE,
        sortBy = "createdAt",
        sortDirection = DEFAULT_SORT_DIRECTION,
        searchNameTerm = "",
      } = req.query;

      const blogs = await blogsService.getBlogs({
        pageNumber: Number(pageNumber) || DEFAULT_PAGE,
        pageSize: Number(pageSize) || DEFAULT_PAGE_SIZE,
        sortBy: (sortBy as string) || "createdAt",
        sortDirection: (sortDirection as string) || DEFAULT_SORT_DIRECTION,
        searchNameTerm: (searchNameTerm as string) || "",
      });
      return res.status(HTTP_STATUSES.OK).send(blogs);
    } catch (error) {
      next(error);
    }
  },
  getBlogById: async (
    req: Request,
    res: Response<BlogItem | ClientError>,
    next: NextFunction
  ) => {
    try {
      const blog = await blogsService.getBlogById(req.params.id || "");
      if (!blog) {
        return res.status(HTTP_STATUSES.NOT_FOUND).send({
          errorsMessages: [{ field: "id", message: "Blog not found" }],
        });
      }
      return res.status(HTTP_STATUSES.OK).send(blog);
    } catch (error) {
      next(error);
    }
  },
  createBlog: async (
    req: Request<{}, {}, CreateBlogDTO>,
    res: Response<BlogItem | ClientError>,
    next: NextFunction
  ) => {
    try {
      const newBlog = await blogsService.createBlog(req.body);
      return res.status(HTTP_STATUSES.CREATED).send(newBlog);
    } catch (error) {
      next(error);
    }
  },
  updateBlog: async (
    req: Request<{ id: string }, {}, CreateBlogDTO>,
    res: Response<BlogItem | ClientError>,
    next: NextFunction
  ) => {
    try {
      const updatedBlog = await blogsService.updateBlog(req.params.id, req.body);
      if (!updatedBlog) {
        return res.status(HTTP_STATUSES.NOT_FOUND).send({
          errorsMessages: [{ field: "id", message: "Blog not found" }],
        });
      }
      return res.status(HTTP_STATUSES.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
  deleteBlog: async (
    req: Request<{ id: string }>,
    res: Response<boolean | ClientError>,
    next: NextFunction
  ) => {
    try {
      const deletedBlog = await blogsService.deleteBlog(req.params.id);
      if (!deletedBlog) {
        return res.status(HTTP_STATUSES.NOT_FOUND).send({
          errorsMessages: [{ field: "id", message: "Blog not found" }],
        });
      }
      return res.status(HTTP_STATUSES.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
  getBlogPosts: async (
    req: Request<{ id: string }, {}, {}, GetBlogsQuery>,
    res: Response<
      | {
          items: PostItem[];
          totalCount: number;
          pagesCount: number;
          page: number;
          pageSize: number;
        }
      | ClientError
    >,
    next: NextFunction
  ) => {
    try {
      const blog = await blogsService.getBlogById(req.params.id);
      if (!blog) {
        return res.status(HTTP_STATUSES.NOT_FOUND).send({
          errorsMessages: [{ field: "id", message: "Blog not found" }],
        });
      }

      const {
        pageNumber = DEFAULT_PAGE,
        pageSize = DEFAULT_PAGE_SIZE,
        sortBy = "createdAt",
        sortDirection = DEFAULT_SORT_DIRECTION,
      } = req.query;

      const posts = await postsService.getPostsByBlogId(req.params.id, {
        pageNumber: Number(pageNumber) || DEFAULT_PAGE,
        pageSize: Number(pageSize) || DEFAULT_PAGE_SIZE,
        sortBy: (sortBy as string) || "createdAt",
        sortDirection: (sortDirection as string) || DEFAULT_SORT_DIRECTION,
      });

      return res.status(HTTP_STATUSES.OK).send(posts);
    } catch (error) {
      next(error);
    }
  },
  createPostForBlog: async (
    req: Request<{ id: string }, {}, Omit<CreatePostDTO, "blogId">>,
    res: Response<PostItem | ClientError>,
    next: NextFunction
  ) => {
    try {
      const blog = await blogsService.getBlogById(req.params.id);
      if (!blog) {
        return res.status(HTTP_STATUSES.NOT_FOUND).send({
          errorsMessages: [{ field: "id", message: "Blog not found" }],
        });
      }

      const post = await postsService.createPostForBlog(req.params.id, req.body);
      if (!post) {
        return res.status(HTTP_STATUSES.NOT_FOUND).send({
          errorsMessages: [{ field: "id", message: "Blog not found" }],
        });
      }

      return res.status(HTTP_STATUSES.CREATED).send(post);
    } catch (error) {
      next(error);
    }
  },
};
