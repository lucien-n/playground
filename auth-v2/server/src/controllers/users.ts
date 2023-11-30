import { LibSQLDatabase } from "drizzle-orm/libsql";
import { Request, Response } from "express";

export const createUserController = (db: LibSQLDatabase) => {
  return {
    getUser: async (req: Request, res: Response) => {
      const id = req.params.id;

      const user = {
        uid: id,
        username: "TestUser",
        email: "test.user@mail.com",
        password: "testUser123",
      };

      res.status(200).json({ data: [user] });
    },
  };
};
