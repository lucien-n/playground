import express, { type Express } from "express";
import { initDb } from "./db";
import { logger } from "./logger";

import dotenv from "dotenv";
import { createUserRouter } from "./routes/users";
dotenv.config();

const app: Express = express();
const port = 8080;

const db = initDb();

app.use(express.json());

createUserRouter(db);

app.listen(port, () => {
  logger.info(`Server listenning on port ${port}`);
});
