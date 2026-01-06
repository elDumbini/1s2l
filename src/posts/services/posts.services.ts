import { CreatePostDTO, UpdatePostDTO } from "../dto/posts.dto";
import { postsRepository } from "../repositories/posts.repository";

export const postsService = {
  getPosts: () => {
    return postsRepository.getPosts();
  },
  getPostById: (id: string) => {
    return postsRepository.getPostById(id);
  },
  createPost: (post: CreatePostDTO) => {
    return postsRepository.createPost(post);
  },
  updatePost: (id: string, newPostData: UpdatePostDTO) => {
    const updatedPost = postsRepository.updatePost(id, newPostData);
    if (!updatedPost) {
      return null;
    }
    return updatedPost;
  },
  deletePost: (id: string) => {
    return postsRepository.deletePost(id);
  },
};
