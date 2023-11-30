import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import { getSession, login, signOut } from "./auth";
import { initDb } from "./database";
import { logger as log } from "./logger";
dotenv.config();

const init = () => {
  const db = initDb();

  const app: Express = express();
  const port = 8080;

  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("Express server response");
  });

  app.post("/auth", async (req: Request, res: Response) => {
    const credentials = req.body;

    const result = await login(db, credentials);

    res.json(result);
  });

  app.get("/auth", async (req: Request, res: Response) => {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const session = await getSession(db, token);

    res.status(200).json({ data: session });
  });

  app.get("/auth/signout", async (req: Request, res: Response) => {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const result = await signOut(db, token);

    res.json(result);
  });

  app.listen(port, () => {
    log.info("Server running on port", port);
  });
};

init();
