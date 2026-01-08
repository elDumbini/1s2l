import { CreatePostDTO, UpdatePostDTO } from "../dto/posts.dto";
import { postsRepository } from "../repositories/posts.repository";
import { PostItem } from "../types/posts";

export const postsService = {
  getPosts: async (): Promise<PostItem[]> => {
    return await postsRepository.getPosts();
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
};
