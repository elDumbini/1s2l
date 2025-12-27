import { BlogItem } from "../blogs/types/types";
import { PostItem } from "../posts/types/posts";

export const db: { blogs: BlogItem[]; posts: PostItem[] } = {
  blogs: [
    {
      id: 1,
      name: "Blog 1",
      description: "Blog 1 description",
      websiteUrl: "https://blog1.com",
    },
  ],
  posts: [
    {
      id: 1,
      title: "Post 1",
      shortDescription: "Post 1 description",
      content: "Post 1 content",
      blogId: 1,
      blogName: "Blog 1",
    },
  ],
};
