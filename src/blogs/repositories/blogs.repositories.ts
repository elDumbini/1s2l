//@ts-nocheck

import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { blogCollection } from "../../db/mongodb";
import { CreateBlogDTO } from "../dto/blogs.dto";
import { BlogItem } from "../types/types";

export const blogsRepository = {
  getBlogs: async (): Promise<BlogItem[]> => {
    const blogs = await blogCollection.find({}).toArray();
    return blogs.map((blog) => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    }));
  },
  getBlogById: async (id: string): Promise<BlogItem | null> => {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const blog = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return null;
    }
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  },
  createBlog: async (blog: CreateBlogDTO): Promise<BlogItem> => {
    const createdAt = new Date().toISOString();
    const result: InsertOneResult<WithId<BlogItem>> =
      await blogCollection.insertOne({
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt,
        isMembership: false,
      });

    return {
      id: result.insertedId.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt,
      isMembership: false,
    };
  },
  updateBlog: async (
    id: string,
    newBlogData: CreateBlogDTO
  ): Promise<BlogItem | null> => {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const result = await blogCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: newBlogData.name,
          description: newBlogData.description,
          websiteUrl: newBlogData.websiteUrl,
        },
      },
      { returnDocument: "after" }
    );
    if (!result) {
      return null;
    }
    return {
      id: result._id.toString(),
      name: result.name,
      description: result.description,
      websiteUrl: result.websiteUrl,
      createdAt: result.createdAt,
      isMembership: result.isMembership,
    };
  },
  deleteBlog: async (id: string): Promise<boolean> => {
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
};
