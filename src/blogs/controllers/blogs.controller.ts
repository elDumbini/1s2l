import { Request, Response, NextFunction } from "express";
import { CreateBlogDTO, GetBlogsDTO } from "../dto/blogs.dto";
import { ClientError, HTTP_STATUSES } from "../../core/types/types";
import { BlogItem, GetBlogsQuery } from "../types/types";
import { blogsService } from "../services/blogs.services";
import { postsService } from "../../posts/services/posts.services";
import { PostItem } from "../../posts/types/posts";
import { CreatePostDTO } from "../../posts/dto/posts.dto";
import { NotFoundError } from "../../core/utils/errorsInstances";

export const blogsController = {
  getBlogs: async (
    req: Request<{}, {}, {}, GetBlogsQuery>,
    res: Response<GetBlogsDTO>,
    next: NextFunction
  ) => {
    try {
      const blogs = await blogsService.getBlogs(req.query);
      return res.status(HTTP_STATUSES.OK).send(blogs);
    } catch (error) {
      next(error);
    }
  },

  getBlogById: async (
    req: Request<{ id: string }>,
    res: Response<BlogItem | ClientError>,
    next: NextFunction
  ) => {
    try {
      const blog = await blogsService.getBlogById(req.params.id);
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
    res: Response<void | ClientError>,
    next: NextFunction
  ) => {
    try {
      await blogsService.updateBlog(req.params.id, req.body);
      return res.status(HTTP_STATUSES.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },

  deleteBlog: async (
    req: Request<{ id: string }>,
    res: Response<void | ClientError>,
    next: NextFunction
  ) => {
    try {
      await blogsService.deleteBlog(req.params.id);
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
      // Проверяем существование блога
      await blogsService.getBlogById(req.params.id);

      const posts = await postsService.getPostsByBlogId(req.params.id, req.query);
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
      // Проверяем существование блога
      await blogsService.getBlogById(req.params.id);

      const post = await postsService.createPostForBlog(req.params.id, req.body);
      return res.status(HTTP_STATUSES.CREATED).send(post);
    } catch (error) {
      next(error);
    }
  },
};
