import { Request, Response } from "express";
import { CreatePostDTO, GetPostDTO, GetPostsDTO, UpdatePostDTO } from "../dto/posts.dto";
import { ClientError, HTTP_STATUSES } from "../../core/types/types";
import { postsService } from "../services/posts.services";
import { PostItem } from "../types/posts";

export const postsController = {
  getPosts: (_: any, res: Response<PostItem[]>) => {
    return res.status(HTTP_STATUSES.OK).send(postsService.getPosts());
  },
  getPostById: (
    req: Request<{ id: string }>,
    res: Response<GetPostDTO | ClientError>
  ) => {
    const post = postsService.getPostById(Number(req.params.id));
    if (!post) {
      return res.status(HTTP_STATUSES.NOT_FOUND).send({
        errorsMessages: [{ field: "id", message: "Post not found" }],
      });
    }
    return res.status(HTTP_STATUSES.OK).send(post);
  },
  createPost: (
    req: Request<{}, {}, CreatePostDTO>,
    res: Response<number | ClientError>
  ) => {
    const post = postsService.createPost(req.body);
    if (!post) {
      return res.status(HTTP_STATUSES.NOT_FOUND).send({
        errorsMessages: [{ field: "blogId", message: "Blog not found" }],
      });
    }
    return res.status(HTTP_STATUSES.CREATED).send(post);
  },
  updatePost: (
    req: Request<{ id: string }, {}, UpdatePostDTO>,
    res: Response<PostItem | ClientError>
  ) => {
    const updatedPost = postsService.updatePost(
      Number(req.params.id),
      req.body
    );
    if (!updatedPost) {
      return res.status(HTTP_STATUSES.NOT_FOUND).send({
        errorsMessages: [{ field: "id", message: "Post not found or Blog not found" }],
      });
    }
    return res.status(HTTP_STATUSES.NO_CONTENT).send(updatedPost);
  },
  deletePost: (
    req: Request<{ id: string }>,
    res: Response<boolean | ClientError>
  ) => {
    const deletedPost = postsService.deletePost(Number(req.params.id));
    if (!deletedPost) {
      return res.status(HTTP_STATUSES.NOT_FOUND).send({
        errorsMessages: [{ field: "id", message: "Post not found" }],
      });
    }
    return res.status(HTTP_STATUSES.NO_CONTENT).send(deletedPost);
  },
};
