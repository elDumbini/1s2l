import { ObjectId } from "mongodb";
import { blogCollection, postCollection } from "../../db/mongodb";
import { CreatePostDTO, UpdatePostDTO } from "../dto/posts.dto";
import { PostItem } from "../types/posts";

export const postsRepository = {
  getPosts: async (): Promise<PostItem[]> => {
    const posts = await postCollection.find({}).toArray();
    return posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    }));
  },
  getPostById: async (id: string): Promise<PostItem | null> => {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const post = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },
  createPost: async (post: CreatePostDTO): Promise<PostItem | null> => {
    if (!ObjectId.isValid(post.blogId)) {
      return null;
    }
    const blog = await blogCollection.findOne({
      _id: new ObjectId(post.blogId),
    });

    if (!blog) {
      return null;
    }

    const createdAt = new Date().toISOString();
    const result = await postCollection.insertOne({
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt,
    });

    return {
      id: result.insertedId.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: blog.name,
      createdAt,
    };
  },
  updatePost: async (
    id: string,
    newPostData: UpdatePostDTO
  ): Promise<PostItem | null> => {
    if (!ObjectId.isValid(id) || !ObjectId.isValid(newPostData.blogId)) {
      return null;
    }

    const oldPost = await postCollection.findOne({ _id: new ObjectId(id) });
    if (!oldPost) {
      return null;
    }

    const blog = await blogCollection.findOne({
      _id: new ObjectId(newPostData.blogId),
    });
    if (!blog) {
      return null;
    }

    const result = await postCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: newPostData.title,
          shortDescription: newPostData.shortDescription,
          content: newPostData.content,
          blogId: newPostData.blogId,
          blogName: blog.name,
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return null;
    }

    return {
      id: result._id.toString(),
      title: result.title,
      shortDescription: result.shortDescription,
      content: result.content,
      blogId: result.blogId,
      blogName: result.blogName,
      createdAt: result.createdAt,
    };
  },
  deletePost: async (id: string): Promise<boolean> => {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const result = await postCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
};
