import { LibSQLDatabase } from "drizzle-orm/libsql";
import { Router } from "express";
import { createUserController } from "../controllers/users";
import { logger } from "../logger";

export const createUserRouter = (db: LibSQLDatabase) => {
  logger.info("Initializing 'user' router");
  const usersRouter = Router();
  logger.info("Initializing 'user' controller");
  const userController = createUserController(db);

  usersRouter.get("/:id", userController.getUser);
};
