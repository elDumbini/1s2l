import { BlogItem } from "../types/types";

export type GetBlogsDTO = {
  items: BlogItem[];
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;
};
export type CreateBlogDTO = Pick<
  BlogItem,
  "name" | "description" | "websiteUrl"
>;
