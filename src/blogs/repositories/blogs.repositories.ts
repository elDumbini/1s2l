import { randomUUID } from "crypto";
import { db } from "../../db/db";
import { CreateBlogDTO } from "../dto/blogs.dto";
import { BlogItem } from "../types/types";

export const blogsRepository = {
  getBlogs: () => {
    return db.blogs;
  },
  getBlogById: (id: string) => {
    return db.blogs.find((blog) => blog.id === id);
  },
  createBlog: (blog: CreateBlogDTO) => {
    const newBlog = { ...blog, id: Date.now().toString() };
    db.blogs.push(newBlog);
    return newBlog;
  },
  updateBlog: (id: string, newBlogData: CreateBlogDTO) => {
    const index = db.blogs.findIndex((blog) => blog.id === id);
    if (index === -1) {
      return null;
    }

    const oldBlog = db.blogs[index]!;
    const updatedBlog: BlogItem = {
      id: oldBlog.id,
      ...newBlogData,
    };
    db.blogs[index] = updatedBlog;
    return updatedBlog;
  },
  deleteBlog: (id: string) => {
    const index = db.blogs.findIndex((blog) => blog.id === id);
    if (index === -1) {
      return null;
    }
    db.blogs.splice(index, 1);
    return true;
  },
};
