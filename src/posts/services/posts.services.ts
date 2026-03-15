import { CreatePostDTO, UpdatePostDTO } from "../dto/posts.dto";
import { postsRepository } from "../repositories/posts.repository";
import { PostItem, GetPostsQuery } from "../types/posts";

export const postsService = {
  getPosts: async (query: GetPostsQuery) => {
    return await postsRepository.getPosts(query);
  },
  getPostById: async (id: string): Promise<PostItem | null> => {
    return await postsRepository.getPostById(id);
  },
  createPost: async (post: CreatePostDTO): Promise<PostItem | null> => {
    return await postsRepository.createPost(post);
  },
  updatePost: async (
    id: string,
    newPostData: UpdatePostDTO
  ): Promise<PostItem | null> => {
    return await postsRepository.updatePost(id, newPostData);
  },
  deletePost: async (id: string): Promise<boolean> => {
    return await postsRepository.deletePost(id);
  },
  getPostsByBlogId: async (
    blogId: string,
    query: {
      pageNumber: number;
      pageSize: number;
      sortBy: string;
      sortDirection: string;
    }
  ) => {
    return await postsRepository.getPostsByBlogId(blogId, query);
  },
  createPostForBlog: async (
    blogId: string,
    post: Omit<CreatePostDTO, "blogId">
  ): Promise<PostItem | null> => {
    return await postsRepository.createPostForBlog(blogId, post);
  },
};
