import { Request, Response, NextFunction } from "express";
import { CreatePostDTO, GetPostDTO, GetPostsDTO, UpdatePostDTO } from "../dto/posts.dto";
import { ClientError, HTTP_STATUSES } from "../../core/types/types";
import { postsService } from "../services/posts.services";
import { PostItem, GetPostsQuery } from "../types/posts";

export const postsController = {
  getPosts: async (
    req: Request<{}, {}, {}, GetPostsQuery>,
    res: Response<GetPostsDTO | ClientError>,
    next: NextFunction
  ) => {
    try {
      const posts = await postsService.getPosts(req.query);
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
      return res.status(HTTP_STATUSES.CREATED).send(post);
    } catch (error) {
      next(error);
    }
  },

  updatePost: async (
    req: Request<{ id: string }, {}, UpdatePostDTO>,
    res: Response<void | ClientError>,
    next: NextFunction
  ) => {
    try {
      await postsService.updatePost(req.params.id, req.body);
      return res.status(HTTP_STATUSES.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },

  deletePost: async (
    req: Request<{ id: string }>,
    res: Response<void | ClientError>,
    next: NextFunction
  ) => {
    try {
      await postsService.deletePost(req.params.id);
      return res.status(HTTP_STATUSES.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
};
