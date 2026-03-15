//@ts-nocheck

import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { blogCollection } from "../../db/mongodb";
import { CreateBlogDTO } from "../dto/blogs.dto";
import { BlogItem } from "../types/types";

export const blogsRepository = {
  getBlogs: async (query: GetBlogsQuery): Promise<{
    items: BlogItem[];
    totalCount: number;
    pagesCount: number;
    page: number;
    pageSize: number;
  }> => {
    try {
      if (!blogCollection) {
        console.error("Blog collection not initialized");
        return {
          items: [],
          totalCount: 0,
          pagesCount: 0,
          page: 1,
          pageSize: 10,
        };
      }

      const { 
        pageNumber = 1, 
        pageSize = 10, 
        sortBy = "createdAt", 
        sortDirection = "desc",
        searchNameTerm = "" 
      } = query;

      const skip = (pageNumber - 1) * pageSize;
      const filter: any = {};

      if (searchNameTerm) {
        filter.$or = [];

        filter.$or.push({
          name: { $regex: searchNameTerm, $options: "i" },
        });
      }

      // Преобразуем sortDirection в число для MongoDB
      const sortDir = sortDirection === "asc" ? 1 : -1;

      const items = await blogCollection
        .find(filter)
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(pageSize)
        .toArray();

      const totalCount = await blogCollection.countDocuments(filter);

      return {
        items: items.map((blog) => ({
          id: blog._id.toString(),
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
          createdAt: blog.createdAt,
          isMembership: blog.isMembership,
        })),
        totalCount,
        pagesCount: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
      };
    } catch (error) {
      console.error("Error getting blogs:", error);
      return {
        items: [],
        totalCount: 0,
        pagesCount: 0,
        page: 1,
        pageSize: 10,
      };
    }
  },
  getBlogById: async (id: string): Promise<BlogItem | null> => {
    try {
      if (!blogCollection) {
        console.error("Blog collection not initialized");
        return null;
      }
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
    } catch (error) {
      console.error("Error getting blog by id:", error);
      return null;
    }
  },
  createBlog: async (blog: CreateBlogDTO): Promise<BlogItem> => {
    try {
      if (!blogCollection) {
        throw new Error("Blog collection not initialized");
      }
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
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  },
  updateBlog: async (
    id: string,
    newBlogData: CreateBlogDTO
  ): Promise<BlogItem | null> => {
    try {
      if (!blogCollection) {
        console.error("Blog collection not initialized");
        return null;
      }
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
    } catch (error) {
      console.error("Error updating blog:", error);
      return null;
    }
  },
  deleteBlog: async (id: string): Promise<boolean> => {
    try {
      if (!blogCollection) {
        console.error("Blog collection not initialized");
        return false;
      }
      if (!ObjectId.isValid(id)) {
        return false;
      }
      const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error deleting blog:", error);
      return false;
    }
  },
};
