import { CreateBlogDTO } from "../dto/blogs.dto";
import { blogsRepository } from "../repositories/blogs.repositories";
import { BlogItem } from "../types/types";

export const blogsService = {
  getBlogs: async (): Promise<BlogItem[]> => {
    return await blogsRepository.getBlogs();
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
