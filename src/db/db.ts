import { BlogItem } from "../blogs/types/types";
import { PostItem } from "../posts/types/posts";

export const db: { blogs: BlogItem[]; posts: PostItem[] } = {
  blogs: [],
  posts: [],
};
