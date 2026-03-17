import { BlogItem } from "../types/types";
import { PaginatedResponse } from "../../core/types/common.types";

// Response DTOs
export type GetBlogsDTO = PaginatedResponse<BlogItem>;

// Request DTOs
export type CreateBlogDTO = Pick<
  BlogItem,
  "name" | "description" | "websiteUrl"
>;
