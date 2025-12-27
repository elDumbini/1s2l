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
    console.log("id", id);
    const oldBlog = db.blogs.find((blog) => blog.id === id);
    console.log("oldBlog", oldBlog);
    if (!oldBlog) {
      return null;
    }

    return { ...oldBlog, ...newBlogData };
  },
  deleteBlog: (id: number) => {
    const index = db.blogs.findIndex((blog) => blog.id === id);
    if (index === -1) {
      return null;
    }
    db.blogs.splice(index, 1);
    return true;
  },
};
