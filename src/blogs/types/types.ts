import { PaginationQuery } from "../../core/types/common.types";

// Domain types (сущности домена)
export type BlogItem = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

// Query types (для HTTP запросов)
export type GetBlogsQuery = PaginationQuery & {
  searchNameTerm?: string;
};
