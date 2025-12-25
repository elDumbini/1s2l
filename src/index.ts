// Дата в формате ISO (new Date().toISOString())

// Обратим внимание на свойство availableResolutions (иллюстрирует выбор качества видео) в документации -
// это массив строковых значенией (констант). При валидации входных параматров (body) нужно учитывать,
// что эти значения не должны отличаться от значений из перечисления
// (enum): "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"

import express from "express";
import { setupApp } from "./setup-app";
import { db } from "./db/db";

const app = express();
setupApp(app);

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
export default app;
