import { BlogItem } from "../types/types";

export type GetBlogsDTO = BlogItem[];
export type CreateBlogDTO = Pick<
  BlogItem,
  "name" | "description" | "websiteUrl"
>;
