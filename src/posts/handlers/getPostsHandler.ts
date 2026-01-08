import { Request, Response } from "express";
import { postsService } from "../services/posts.services";
import { GetPostDTO } from "../dto/posts.dto";
import { ClientError, HTTP_STATUSES } from "../../core/types/types";
import { ServiceError } from "../../core/utils/errorsInstances";

export const getPostHandler = async (
  req: Request<{ id: string }>,
  res: Response<GetPostDTO | ClientError>
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
    throw new ServiceError("Service error", error as Error);
  }
};
