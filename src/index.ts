import express from "express";
import { setupApp } from "./setup-app";
import "dotenv/config";

const app = express();
setupApp(app);

const PORT = process.env.PORT || 5001;

// Для Render.com сервер должен запускаться всегда
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;