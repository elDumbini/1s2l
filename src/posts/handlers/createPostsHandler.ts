import { Request, Response } from "express";
import { postsService } from "../services/posts.services";
import { CreatePostDTO, GetPostDTO } from "../dto/posts.dto";
import { ClientError, HTTP_STATUSES } from "../../core/types/types";
import { ServiceError } from "../../core/utils/errorsInstances";

export const createPostHandler = (
  req: Request<CreatePostDTO>,
  res: Response<GetPostDTO | ClientError>
) => {
  try {
    const post = postsService.createPost(req.body);

    return post;
  } catch (error) {
    throw new ServiceError("Service error", error as Error);
  }
};
