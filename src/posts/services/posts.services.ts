import { CreatePostDTO, UpdatePostDTO } from "../dto/posts.dto";
import { postsRepository } from "../repositories/posts.repository";

export const postsService = {
  getPosts: () => {
    return postsRepository.getPosts();
  },
  getPostById: (id: number) => {
    return postsRepository.getPostById(id);
  },
  createPost: (post: CreatePostDTO) => {
    return postsRepository.createPost(post);
  },
  updatePost: (id: number, newPostData: UpdatePostDTO) => {
    const updatedPost = postsRepository.updatePost(id, newPostData);
    if (!updatedPost) {
      return null;
    }
    return updatedPost;
  },
  deletePost: (id: number) => {
    return postsRepository.deletePost(id);
  },
};
