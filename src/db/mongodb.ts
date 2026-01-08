import { Collection, Db, MongoClient } from "mongodb";
import { BlogItem } from "../blogs/types/types";
import { PostItem } from "../posts/types/posts";

export let client: MongoClient;
export let db: Db;
export let blogCollection: Collection<BlogItem>;
export let postCollection: Collection<PostItem>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url);
  db = client.db("mememe");
  
  try {
    await client.connect();
    await db.command({ ping: 1 });
    
    blogCollection = db.collection<BlogItem>("blogs");
    postCollection = db.collection<PostItem>("posts");
    
    console.log("✅ Connected to the database");
  } catch (e) {
    await client.close();
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
