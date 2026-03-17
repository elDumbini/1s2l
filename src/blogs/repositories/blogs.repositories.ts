import { ObjectId, WithId } from "mongodb";
import { blogCollection } from "../../db/mongodb";
import { CreateBlogDTO } from "../dto/blogs.dto";
import { BlogItem } from "../types/types";
import { PaginatedResponse, MongoSortDirection } from "../../core/types/common.types";

// Типы для работы с БД (внутренние типы репозитория)
type BlogDocument = WithId<{
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
}>;

type GetBlogsParams = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: MongoSortDirection;
  searchNameTerm?: string;
};

// Утилита для преобразования документа БД в доменную модель
const mapDocumentToBlog = (doc: BlogDocument): BlogItem => ({
  id: doc._id.toString(),
  name: doc.name,
  description: doc.description,
  websiteUrl: doc.websiteUrl,
  createdAt: doc.createdAt,
  isMembership: doc.isMembership,
});

export const blogsRepository = {
  getBlogs: async (
    params: GetBlogsParams
  ): Promise<PaginatedResponse<BlogItem>> => {
    if (!blogCollection) {
      throw new Error("Blog collection not initialized");
    }

    const { pageNumber, pageSize, sortBy, sortDirection, searchNameTerm } =
      params;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    }

    const [items, totalCount] = await Promise.all([
      blogCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      blogCollection.countDocuments(filter),
    ]);

    return {
      items: items.map(mapDocumentToBlog),
      totalCount,
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
    };
  },

  getBlogById: async (id: string): Promise<BlogItem | null> => {
    if (!blogCollection) {
      throw new Error("Blog collection not initialized");
    }

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const blog = await blogCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!blog) {
      return null;
    }

    return mapDocumentToBlog(blog as BlogDocument);
  },

  createBlog: async (blog: CreateBlogDTO): Promise<BlogItem> => {
    if (!blogCollection) {
      throw new Error("Blog collection not initialized");
    }

    const createdAt = new Date().toISOString();
    const result = await blogCollection.insertOne({
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
    if (!blogCollection) {
      throw new Error("Blog collection not initialized");
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

    return mapDocumentToBlog(result as BlogDocument);
  },

  deleteBlog: async (id: string): Promise<boolean> => {
    if (!blogCollection) {
      throw new Error("Blog collection not initialized");
    }

    if (!ObjectId.isValid(id)) {
      return false;
    }

    const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },
};
