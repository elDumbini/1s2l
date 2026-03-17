import { PaginationQuery } from "../../core/types/common.types";

// Domain types (сущности домена)
export type PostItem = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

// Query types (для HTTP запросов)
export type GetPostsQuery = PaginationQuery;
