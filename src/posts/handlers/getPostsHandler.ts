import { Request, Response } from "express";
import { postsService } from "../services/posts.services";
import { GetPostDTO } from "../dto/posts.dto";
import { ClientError, HTTP_STATUSES } from "../../core/types/types";
import { ServiceError } from "../../core/utils/errorsInstances";

export const getPostHandler = (
  req: Request<{ id: string }>,
  res: Response<GetPostDTO | ClientError>
) => {
  try {
    const post = postsService.getPostById(Number(req.params.id));
    if (!post) {
      return res.status(HTTP_STATUSES.NOT_FOUND).send({
        errorsMessages: [{ field: "id", message: "Post not found" }],
      });
    }
  } catch (error) {
    throw new ServiceError("Service error", error as Error);
  }
};
