import express from "express";
import { setupApp } from "./setup-app";
import "dotenv/config";
import { runDB } from "./db/mongodb";

const PORT = process.env.PORT || 5001;

const bootstrap = async () => {
  const app = express();
  setupApp(app);

  // Запускаем сервер даже если БД не подключилась
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });

  // Пытаемся подключиться к БД асинхронно
  const mongoUrl =
    process.env.MONGO_URL ||
    "mongodb+srv://mememe:123456cxzER@cluster0.djuezb4.mongodb.net/?appName=Cluster0";
  
  runDB(mongoUrl).catch((error) => {
    console.error("Failed to connect to database:", error);
    console.error("Application will continue running, but database operations may fail");
  });

  return app;
};

// Обработка необработанных отклонений промисов
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Не завершаем процесс, просто логируем
});

// Обработка необработанных исключений
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Не завершаем процесс во время тестов
});

bootstrap().catch((error) => {
  console.error("Bootstrap failed:", error);
  process.exit(1);
});
