import express from "express";
import { setupApp } from "./setup-app";
import "dotenv/config";
import { runDB } from "./db/mongodb";

const PORT = process.env.PORT || 5001;

const bootstrap = async () => {
  const app = express();
  setupApp(app);

  const mongoUrl =
    process.env.MONGO_URL ||
    "mongodb+srv://mememe:123456cxzER@cluster0.djuezb4.mongodb.net/?appName=Cluster0";
  await runDB(mongoUrl);

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
  return app;
};

bootstrap();
