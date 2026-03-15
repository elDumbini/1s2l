import { DatabaseError } from "../../core/utils/errorsInstances";
import { CreateBlogDTO } from "../dto/blogs.dto";
import { blogsRepository } from "../repositories/blogs.repositories";
import { BlogItem, GetBlogsQuery } from "../types/types";

export const blogsService = {
  getBlogs: async (query: GetBlogsQuery) => {
    try {
      const res = await blogsRepository.getBlogs(query);
      console.log(res);
      return res;
    } catch (error) {
      throw new DatabaseError(
        error instanceof Error ? error.message : "Failed to get blogs",
        error instanceof Error ? error : undefined
      );
    }
  },
  getBlogById: async (id: string): Promise<BlogItem | null> => {
    return await blogsRepository.getBlogById(id);
  },
  createBlog: async (blog: CreateBlogDTO): Promise<BlogItem> => {
    return await blogsRepository.createBlog(blog);
  },
  updateBlog: async (
    id: string,
    newBlogData: CreateBlogDTO
  ): Promise<BlogItem | null> => {
    return await blogsRepository.updateBlog(id, newBlogData);
  },
  deleteBlog: async (id: string): Promise<boolean> => {
    return await blogsRepository.deleteBlog(id);
  },
};
