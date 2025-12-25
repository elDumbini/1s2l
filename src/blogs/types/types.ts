export type BlogItem = {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
};

export type PostItem = {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blogName: string;
};
