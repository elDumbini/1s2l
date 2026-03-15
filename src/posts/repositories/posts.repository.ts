import { ObjectId } from "mongodb";
import { blogCollection, postCollection } from "../../db/mongodb";
import { CreatePostDTO, UpdatePostDTO } from "../dto/posts.dto";
import { PostItem, GetPostsQuery } from "../types/posts";

export const postsRepository = {
  getPosts: async (query: GetPostsQuery): Promise<{
    items: PostItem[];
    totalCount: number;
    pagesCount: number;
    page: number;
    pageSize: number;
  }> => {
    try {
      if (!postCollection) {
        console.error("Post collection not initialized");
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
        sortDirection = "desc" 
      } = query;

      const skip = (pageNumber - 1) * pageSize;

      // Преобразуем sortDirection в число для MongoDB
      const sortDir = sortDirection === "asc" ? 1 : -1;

      const items = await postCollection
        .find({})
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(pageSize)
        .toArray();

      const totalCount = await postCollection.countDocuments({});

      return {
        items: items.map((post) => ({
          id: post._id.toString(),
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt,
        })),
        totalCount,
        pagesCount: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
      };
    } catch (error) {
      console.error("Error getting posts:", error);
      return {
        items: [],
        totalCount: 0,
        pagesCount: 0,
        page: 1,
        pageSize: 10,
      };
    }
  },
  getPostById: async (id: string): Promise<PostItem | null> => {
    try {
      if (!postCollection) {
        console.error("Post collection not initialized");
        return null;
      }
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
    } catch (error) {
      console.error("Error getting post by id:", error);
      return null;
    }
  },
  createPost: async (post: CreatePostDTO): Promise<PostItem | null> => {
    try {
      if (!postCollection || !blogCollection) {
        console.error("Collections not initialized");
        return null;
      }
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
    } catch (error) {
      console.error("Error creating post:", error);
      return null;
    }
  },
  updatePost: async (
    id: string,
    newPostData: UpdatePostDTO
  ): Promise<PostItem | null> => {
    try {
      if (!postCollection || !blogCollection) {
        console.error("Collections not initialized");
        return null;
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
    } catch (error) {
      console.error("Error updating post:", error);
      return null;
    }
  },
  deletePost: async (id: string): Promise<boolean> => {
    try {
      if (!postCollection) {
        console.error("Post collection not initialized");
        return false;
      }
      if (!ObjectId.isValid(id)) {
        return false;
      }
      const result = await postCollection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error deleting post:", error);
      return false;
    }
  },
  getPostsByBlogId: async (
    blogId: string,
    query: {
      pageNumber: number;
      pageSize: number;
      sortBy: string;
      sortDirection: string;
    }
  ): Promise<{
    items: PostItem[];
    totalCount: number;
    pagesCount: number;
    page: number;
    pageSize: number;
  }> => {
    try {
      if (!postCollection) {
        console.error("Post collection not initialized");
        return {
          items: [],
          totalCount: 0,
          pagesCount: 0,
          page: query.pageNumber || 1,
          pageSize: query.pageSize || 10,
        };
      }

      if (!ObjectId.isValid(blogId)) {
        return {
          items: [],
          totalCount: 0,
          pagesCount: 0,
          page: query.pageNumber,
          pageSize: query.pageSize,
        };
      }

      const { 
        pageNumber = 1, 
        pageSize = 10, 
        sortBy = "createdAt", 
        sortDirection = "desc" 
      } = query;
      const skip = (pageNumber - 1) * pageSize;

      // Преобразуем sortDirection в число для MongoDB
      const sortDir = sortDirection === "asc" ? 1 : -1;

      const items = await postCollection
        .find({ blogId })
        .sort({ [sortBy]: sortDir })
        .skip(skip)
        .limit(pageSize)
        .toArray();

      const totalCount = await postCollection.countDocuments({ blogId });

      return {
        items: items.map((post) => ({
          id: post._id.toString(),
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt,
        })),
        totalCount,
        pagesCount: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
      };
    } catch (error) {
      console.error("Error getting posts by blog id:", error);
      return {
        items: [],
        totalCount: 0,
        pagesCount: 0,
        page: query.pageNumber || 1,
        pageSize: query.pageSize || 10,
      };
    }
  },
  createPostForBlog: async (
    blogId: string,
    post: Omit<CreatePostDTO, "blogId">
  ): Promise<PostItem | null> => {
    try {
      if (!postCollection || !blogCollection) {
        console.error("Collections not initialized");
        return null;
      }
      
      if (!ObjectId.isValid(blogId)) {
        return null;
      }
      const blog = await blogCollection.findOne({
        _id: new ObjectId(blogId),
      });

      if (!blog) {
        return null;
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
    } catch (error) {
      console.error("Error creating post for blog:", error);
      return null;
    }
  },
};
