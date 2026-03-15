import { Collection, Db, MongoClient } from "mongodb";
import { BlogItem } from "../blogs/types/types";
import { PostItem } from "../posts/types/posts";

export let client: MongoClient;
export let db: Db;
export let blogCollection: Collection<BlogItem>;
export let postCollection: Collection<PostItem>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url, {
    serverSelectionTimeoutMS: 5000, // 5 секунд таймаут
    connectTimeoutMS: 10000, // 10 секунд на подключение
  });
  db = client.db("mememe");
  
  try {
    await client.connect();
    await db.command({ ping: 1 });
    
    blogCollection = db.collection<BlogItem>("blogs");
    postCollection = db.collection<PostItem>("posts");
    
    console.log("✅ Connected to the database");
  } catch (e) {
    console.error("❌ Database connection error:", e);
    try {
      await client.close();
    } catch (closeError) {
      // Игнорируем ошибки закрытия
    }
    throw new Error(`❌ Database not connected: ${e}`);
  }
}
