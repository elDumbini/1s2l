import { db } from "../../db/db";
import { CreatePostDTO, UpdatePostDTO } from "../dto/posts.dto";

export const postsRepository = {
  getPosts: () => {
    return db.posts;
  },
  getPostById: (id: string) => {
    const post = db.posts.find((post) => post.id === id);
    if (!post) {
      return null;
    }
    return post;
  },
  createPost: (post: CreatePostDTO) => {
    const blog = db.blogs.find((blog) => blog.id === post.blogId);

    if (!blog) {
      return null;
    }

    const newPost = {
      ...post,
      blogName: blog.name,
      id: Date.now().toString(),
    };
    db.posts.push(newPost);
    return newPost;
  },
  updatePost: (id: string, newPostData: UpdatePostDTO) => {
    const oldPost = db.posts.find((post) => post.id === id);
    if (!oldPost) {
      return null;
    }

    const blog = db.blogs.find((blog) => blog.id === newPostData.blogId);
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
  deletePost: (id: string) => {
    const index = db.posts.findIndex((post) => post.id === id);
    if (index === -1) {
      return null;
    }
    db.posts.splice(index, 1);
    return true;
  },
};
