import { PostItem } from "../types/posts";
import { PaginatedResponse } from "../../core/types/common.types";

// Response DTOs
export type GetPostsDTO = PaginatedResponse<PostItem>;
export type GetPostDTO = PostItem;

// Request DTOs
export type CreatePostDTO = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type UpdatePostDTO = CreatePostDTO;
