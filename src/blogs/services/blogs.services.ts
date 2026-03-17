import { DatabaseError, NotFoundError } from "../../core/utils/errorsInstances";
import { CreateBlogDTO } from "../dto/blogs.dto";
import { blogsRepository } from "../repositories/blogs.repositories";
import { BlogItem, GetBlogsQuery } from "../types/types";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  SortDirection,
} from "../../core/validations/core.validations";
import { PaginatedResponse } from "../../core/types/common.types";
import { toMongoSortDirection } from "../../core/types/common.types";

export const blogsService = {
  getBlogs: async (
    query: GetBlogsQuery
  ): Promise<PaginatedResponse<BlogItem>> => {
    try {
      const pageNumber = query.pageNumber || DEFAULT_PAGE;
      const pageSize = query.pageSize || DEFAULT_PAGE_SIZE;
      const sortBy = query.sortBy || "createdAt";
      const sortDirection =
        (query.sortDirection as SortDirection) || DEFAULT_SORT_DIRECTION;
      const searchNameTerm = query.searchNameTerm || "";

      return await blogsRepository.getBlogs({
        pageNumber,
        pageSize,
        sortBy,
        sortDirection: toMongoSortDirection(sortDirection),
        searchNameTerm,
      });
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get blogs",
        error instanceof Error ? error : undefined
      );
    }
  },

  getBlogById: async (id: string): Promise<BlogItem> => {
    try {
      const blog = await blogsRepository.getBlogById(id);
      if (!blog) {
        throw new NotFoundError("Blog not found");
      }
      return blog;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get blog",
        error instanceof Error ? error : undefined
      );
    }
  },

  createBlog: async (blog: CreateBlogDTO): Promise<BlogItem> => {
    try {
      return await blogsRepository.createBlog(blog);
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to create blog",
        error instanceof Error ? error : undefined
      );
    }
  },

  updateBlog: async (
    id: string,
    newBlogData: CreateBlogDTO
  ): Promise<void> => {
    try {
      const updatedBlog = await blogsRepository.updateBlog(id, newBlogData);
      if (!updatedBlog) {
        throw new NotFoundError("Blog not found");
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to update blog",
        error instanceof Error ? error : undefined
      );
    }
  },

  deleteBlog: async (id: string): Promise<void> => {
    try {
      const deleted = await blogsRepository.deleteBlog(id);
      if (!deleted) {
        throw new NotFoundError("Blog not found");
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to delete blog",
        error instanceof Error ? error : undefined
      );
    }
  },
};
