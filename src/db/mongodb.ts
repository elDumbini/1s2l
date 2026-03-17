import { Collection, Db, MongoClient, Document } from "mongodb";

// Внутренние типы документов БД (с _id)
type BlogDocument = Document & {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

type PostDocument = Document & {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

type UserDocument = Document & {
  email: string;
  login: string;
  createdAt: string;
  hashedPassword: string;
  salt: string;
};

export let client: MongoClient;
export let db: Db;
export let blogCollection: Collection<BlogDocument>;
export let postCollection: Collection<PostDocument>;
export let usersCollection: Collection<UserDocument>;

export async function runDB(url: string): Promise<void> {
  client = new MongoClient(url, {
    serverSelectionTimeoutMS: 5000, // 5 секунд таймаут
    connectTimeoutMS: 10000, // 10 секунд на подключение
  });
  db = client.db("mememe");

  try {
    await client.connect();
    await db.command({ ping: 1 });

    blogCollection = db.collection<BlogDocument>("blogs");
    postCollection = db.collection<PostDocument>("posts");
    usersCollection = db.collection<UserDocument>("users");

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
