import { Request, Response, NextFunction } from "express";
import { CreatePostDTO, GetPostDTO, GetPostsDTO, UpdatePostDTO } from "../dto/posts.dto";
import { ClientError, HTTP_STATUSES } from "../../core/types/types";
import { postsService } from "../services/posts.services";
import { PostItem, GetPostsQuery } from "../types/posts";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
} from "../../core/validations/core.validations";

export const postsController = {
  getPosts: async (
    req: Request<{}, {}, {}, GetPostsQuery>,
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
      const {
        pageNumber = DEFAULT_PAGE,
        pageSize = DEFAULT_PAGE_SIZE,
        sortBy = "createdAt",
        sortDirection = DEFAULT_SORT_DIRECTION,
      } = req.query;

      const posts = await postsService.getPosts({
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
  getPostById: async (
    req: Request<{ id: string }>,
    res: Response<GetPostDTO | ClientError>,
    next: NextFunction
  ) => {
    try {
      const post = await postsService.getPostById(req.params.id);
      if (!post) {
        return res.status(HTTP_STATUSES.NOT_FOUND).send({
          errorsMessages: [{ field: "id", message: "Post not found" }],
        });
      }
      return res.status(HTTP_STATUSES.OK).send(post);
    } catch (error) {
      next(error);
    }
  },
  createPost: async (
    req: Request<{}, {}, CreatePostDTO>,
    res: Response<PostItem | ClientError>,
    next: NextFunction
  ) => {
    try {
      const post = await postsService.createPost(req.body);
      if (!post) {
        return res.status(HTTP_STATUSES.NOT_FOUND).send({
          errorsMessages: [{ field: "blogId", message: "Blog not found" }],
        });
      }
      return res.status(HTTP_STATUSES.CREATED).send(post);
    } catch (error) {
      next(error);
    }
  },
  updatePost: async (
    req: Request<{ id: string }, {}, UpdatePostDTO>,
    res: Response<PostItem | ClientError>,
    next: NextFunction
  ) => {
    try {
      const updatedPost = await postsService.updatePost(
        req.params.id,
        req.body
      );
      if (!updatedPost) {
        return res.status(HTTP_STATUSES.NOT_FOUND).send({
          errorsMessages: [
            { field: "id", message: "Post not found or Blog not found" },
          ],
        });
      }
      return res.status(HTTP_STATUSES.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
  deletePost: async (
    req: Request<{ id: string }>,
    res: Response<boolean | ClientError>,
    next: NextFunction
  ) => {
    try {
      const deletedPost = await postsService.deletePost(req.params.id);
      if (!deletedPost) {
        return res.status(HTTP_STATUSES.NOT_FOUND).send({
          errorsMessages: [{ field: "id", message: "Post not found" }],
        });
      }
      return res.status(HTTP_STATUSES.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
};
