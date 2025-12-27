import { PostItem } from "../types/posts";

export type CreatePostDTO = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
};

export type GetPostsDTO = CreatePostDTO[];
export type GetPostDTO = PostItem;
export type UpdatePostDTO = CreatePostDTO;
