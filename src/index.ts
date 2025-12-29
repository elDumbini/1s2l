import express from "express";
import { setupApp } from "./setup-app";
import "dotenv/config";

const app = express();
setupApp(app);

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    return console.log(`Server is running on port ${PORT}`);
  });
}
export default app;