import { ObjectId, WithId } from "mongodb";
import { blogCollection, postCollection } from "../../db/mongodb";
import { CreatePostDTO, UpdatePostDTO } from "../dto/posts.dto";
import { PostItem } from "../types/posts";
import { PaginatedResponse, MongoSortDirection } from "../../core/types/common.types";

// Типы для работы с БД (внутренние типы репозитория)
type PostDocument = WithId<{
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
}>;

type GetPostsParams = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: MongoSortDirection;
};

type GetPostsByBlogIdParams = GetPostsParams & {
  blogId: string;
};

// Утилита для преобразования документа БД в доменную модель
const mapDocumentToPost = (doc: PostDocument): PostItem => ({
  id: doc._id.toString(),
  title: doc.title,
  shortDescription: doc.shortDescription,
  content: doc.content,
  blogId: doc.blogId,
  blogName: doc.blogName,
  createdAt: doc.createdAt,
});

export const postsRepository = {
  getPosts: async (params: GetPostsParams): Promise<PaginatedResponse<PostItem>> => {
    if (!postCollection) {
      throw new Error("Post collection not initialized");
    }

    const { pageNumber, pageSize, sortBy, sortDirection } = params;
    const skip = (pageNumber - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      postCollection
        .find({})
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postCollection.countDocuments({}),
    ]);

    return {
      items: items.map(mapDocumentToPost),
      totalCount,
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
    };
  },

  getPostById: async (id: string): Promise<PostItem | null> => {
    if (!postCollection) {
      throw new Error("Post collection not initialized");
    }

    if (!ObjectId.isValid(id)) {
      return null;
    }

    const post = await postCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
      return null;
    }

    return mapDocumentToPost(post as PostDocument);
  },

  createPost: async (post: CreatePostDTO): Promise<PostItem> => {
    if (!postCollection || !blogCollection) {
      throw new Error("Collections not initialized");
    }

    if (!ObjectId.isValid(post.blogId)) {
      throw new Error("Invalid blogId");
    }

    const blog = await blogCollection.findOne({
      _id: new ObjectId(post.blogId),
    });

    if (!blog) {
      throw new Error("Blog not found");
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

  updatePost: async (id: string, newPostData: UpdatePostDTO): Promise<PostItem | null> => {
    if (!postCollection || !blogCollection) {
      throw new Error("Collections not initialized");
    }

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
      throw new Error("Blog not found");
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

    return mapDocumentToPost(result as PostDocument);
  },

  deletePost: async (id: string): Promise<boolean> => {
    if (!postCollection) {
      throw new Error("Post collection not initialized");
    }

    if (!ObjectId.isValid(id)) {
      return false;
    }

    const result = await postCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  },

  getPostsByBlogId: async (
    params: GetPostsByBlogIdParams
  ): Promise<PaginatedResponse<PostItem>> => {
    if (!postCollection) {
      throw new Error("Post collection not initialized");
    }

    if (!ObjectId.isValid(params.blogId)) {
      throw new Error("Invalid blogId");
    }

    const { blogId, pageNumber, pageSize, sortBy, sortDirection } = params;
    const skip = (pageNumber - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      postCollection
        .find({ blogId })
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postCollection.countDocuments({ blogId }),
    ]);

    return {
      items: items.map(mapDocumentToPost),
      totalCount,
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
    };
  },

  createPostForBlog: async (
    blogId: string,
    post: Omit<CreatePostDTO, "blogId">
  ): Promise<PostItem> => {
    if (!postCollection || !blogCollection) {
      throw new Error("Collections not initialized");
    }

    if (!ObjectId.isValid(blogId)) {
      throw new Error("Invalid blogId");
    }

    const blog = await blogCollection.findOne({
      _id: new ObjectId(blogId),
    });

    if (!blog) {
      throw new Error("Blog not found");
    }

    const createdAt = new Date().toISOString();
    const result = await postCollection.insertOne({
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt,
    });

    return {
      id: result.insertedId.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt,
    };
  },
};
