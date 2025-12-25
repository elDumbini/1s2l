import { CreateBlogDTO } from "../dto/blogs.dto";
import { blogsRepository } from "../repositories/blogs.repositories";

export const blogsService = {
  getBlogs: () => {
    return blogsRepository.getBlogs();
  },
  getBlogById: (id: number) => {
    const blog = blogsRepository.getBlogById(id);
    if (!blog) {
      return null;
    }
    return blog;
  },
  createBlog: (blog: CreateBlogDTO) => {
    return blogsRepository.createBlog(blog);
  },
  updateBlog: (id: number, newBlogData: CreateBlogDTO) => {
    const updatedBlog = blogsRepository.updateBlog(id, newBlogData);
    if (!updatedBlog) {
      return null;
    }
    return updatedBlog;
  },
};
