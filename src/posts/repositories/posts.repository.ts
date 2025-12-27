import { db } from "../../db/db";
import { CreatePostDTO, UpdatePostDTO } from "../dto/posts.dto";

export const postsRepository = {
  getPosts: () => {
    return db.posts;
  },
  getPostById: (id: number) => {
    const post = db.posts.find((post) => post.id === id);
    if (!post) {
      return null;
    }
    return post;
  },
  createPost: (post: CreatePostDTO) => {
    const blog = db.blogs.find((blog) => blog.id === Number(post.blogId));

    if (!blog) {
      return null;
    }

    return db.posts.push({
      ...post,
      blogName: blog.name,
      id: db.posts.length + 1,
    });
  },
  updatePost: (id: number, newPostData: UpdatePostDTO) => {
    const oldPost = db.posts.find((post) => post.id === id);
    if (!oldPost) {
      return null;
    }

    const blog = db.blogs.find((blog) => blog.id === Number(newPostData.blogId));
    if (!blog) {
      return null;
    }

    const postIndex = db.posts.findIndex((post) => post.id === id);
    db.posts[postIndex] = {
      id: oldPost.id,
      ...newPostData,
      blogName: blog.name,
    };

    return db.posts[postIndex];
  },
  deletePost: (id: number) => {
    const index = db.posts.findIndex((post) => post.id === id);
    if (index === -1) {
      return null;
    }
    db.posts.splice(index, 1);
    return true;
  },
};
