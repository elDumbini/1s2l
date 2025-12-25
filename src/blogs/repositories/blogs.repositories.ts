import { db } from "../../db/db";
import { CreateBlogDTO } from "../dto/blogs.dto";

export const blogsRepository = {
  getBlogs: () => {
    return db.blogs;
  },
  getBlogById: (id: number) => {
    return db.blogs.find((blog) => blog.id === id);
  },
  createBlog: (blog: CreateBlogDTO) => {
    return db.blogs.push({ ...blog, id: db.blogs.length + 1 });
  },
  updateBlog: (id: number, newBlogData: CreateBlogDTO) => {
    const oldBlog = db.blogs.find((blog) => blog.id === id);
    if (!oldBlog) {
      return null;
    }

    return { ...oldBlog, ...newBlogData };
  },
};
