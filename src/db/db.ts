import { BlogItem, PostItem } from "../blogs/types/types";

export const db: { blogs: BlogItem[]; posts: PostItem[] } = {
  blogs: [
    {
      id: 1,
      name: "Blog 1",
      description: "Blog 1 description",
      websiteUrl: "https://blog1.com",
    },
  ],
  posts: [],
};
