import { DatabaseError, NotFoundError } from "../../core/utils/errorsInstances";
import { CreatePostDTO, UpdatePostDTO } from "../dto/posts.dto";
import { postsRepository } from "../repositories/posts.repository";
import { PostItem, GetPostsQuery } from "../types/posts";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  SortDirection,
} from "../../core/validations/core.validations";
import { PaginatedResponse } from "../../core/types/common.types";
import { toMongoSortDirection } from "../../core/types/common.types";

export const postsService = {
  getPosts: async (query: GetPostsQuery): Promise<PaginatedResponse<PostItem>> => {
    try {
      const pageNumber = query.pageNumber || DEFAULT_PAGE;
      const pageSize = query.pageSize || DEFAULT_PAGE_SIZE;
      const sortBy = query.sortBy || "createdAt";
      const sortDirection =
        (query.sortDirection as SortDirection) || DEFAULT_SORT_DIRECTION;

      return await postsRepository.getPosts({
        pageNumber,
        pageSize,
        sortBy,
        sortDirection: toMongoSortDirection(sortDirection),
      });
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get posts",
        error instanceof Error ? error : undefined
      );
    }
  },

  getPostById: async (id: string): Promise<PostItem> => {
    try {
      const post = await postsRepository.getPostById(id);
      if (!post) {
        throw new NotFoundError("Post not found");
      }
      return post;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get post",
        error instanceof Error ? error : undefined
      );
    }
  },

  createPost: async (post: CreatePostDTO): Promise<PostItem> => {
    try {
      return await postsRepository.createPost(post);
    } catch (error) {
      if (error instanceof Error && error.message === "Blog not found") {
        throw new NotFoundError("Blog not found", "blogId");
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to create post",
        error instanceof Error ? error : undefined
      );
    }
  },

  updatePost: async (id: string, newPostData: UpdatePostDTO): Promise<void> => {
    try {
      const updatedPost = await postsRepository.updatePost(id, newPostData);
      if (!updatedPost) {
        throw new NotFoundError("Post not found");
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof Error && error.message === "Blog not found") {
        throw new NotFoundError("Blog not found", "blogId");
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to update post",
        error instanceof Error ? error : undefined
      );
    }
  },

  deletePost: async (id: string): Promise<void> => {
    try {
      const deleted = await postsRepository.deletePost(id);
      if (!deleted) {
        throw new NotFoundError("Post not found");
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to delete post",
        error instanceof Error ? error : undefined
      );
    }
  },

  getPostsByBlogId: async (
    blogId: string,
    query: {
      pageNumber?: number;
      pageSize?: number;
      sortBy?: string;
      sortDirection?: string;
    }
  ): Promise<PaginatedResponse<PostItem>> => {
    try {
      const pageNumber = query.pageNumber || DEFAULT_PAGE;
      const pageSize = query.pageSize || DEFAULT_PAGE_SIZE;
      const sortBy = query.sortBy || "createdAt";
      const sortDirection =
        (query.sortDirection as SortDirection) || DEFAULT_SORT_DIRECTION;

      return await postsRepository.getPostsByBlogId({
        blogId,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection: toMongoSortDirection(sortDirection),
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid blogId") {
        throw new NotFoundError("Blog not found");
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get posts by blog id",
        error instanceof Error ? error : undefined
      );
    }
  },

  createPostForBlog: async (
    blogId: string,
    post: Omit<CreatePostDTO, "blogId">
  ): Promise<PostItem> => {
    try {
      return await postsRepository.createPostForBlog(blogId, post);
    } catch (error) {
      if (error instanceof Error && error.message === "Blog not found") {
        throw new NotFoundError("Blog not found");
      }
      if (error instanceof Error && error.message === "Invalid blogId") {
        throw new NotFoundError("Blog not found");
      }
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to create post for blog",
        error instanceof Error ? error : undefined
      );
    }
  },
};
