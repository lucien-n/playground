import { Client } from "@libsql/client/.";
import { AuthError, ServerError } from "./enums";
import { logger } from "./logger";

type AuthCredentials = {
  username: string;
  password: string;
};

type Session = {
  user: { uid: string; username: string };
  token: string;
  created_at: number;
};

type ServerResponse = {
  status: number;
  data?: unknown;
  error?: string;
};

const MAX_SESSION_LIFE_SEC = 60 * 60 * 24; // 24 hours

export const login = async (db: Client, crendentials: AuthCredentials) => {
  try {
    const { rows } = await db.execute({
      sql: "SELECT uid, password FROM users WHERE username = ?",
      args: [crendentials.username],
    });

    if (!rows.length)
      return {
        error: AuthError.UserNotFound,
      };

    const { uid, password } = rows[0];

    if (password !== crendentials.password)
      return {
        error: AuthError.WrongCredentials,
      };

    const session = await validateSession(db, uid as string);

    if (!session)
      return {
        error: ServerError.InternalServerError,
      };

    return {
      data: session,
    };
  } catch (e) {
    logger.error(e);
  }
};

const validateSession = async (db: Client, userUid: string) => {
  const currentSession = await getSession(db, userUid);

  const expired = sessionExpired(currentSession);

  if (!expired) return currentSession;

  await createSession(db, userUid);

  const newSession = await getSession(db, userUid);

  return newSession;
};

export const getSession = async (db: Client, token: string) => {
  try {
    const { rows } = await db.execute({
      sql: "SELECT uid, created_at FROM sessions WHERE token = ?",
      args: [token],
    });

    if (!rows.length) return null;

    const { uid, created_at } = rows[0];

    logger.info(
      uid,
      "session is expiring in (sec)",
      MAX_SESSION_LIFE_SEC -
        (new Date().getUTCSeconds() - (created_at as number))
    );

    const user = await getUser(db, uid as string);

    if (!user) {
      logger.error("Could not find user associated with", uid);
      return null;
    }

    return {
      user,
      token: token as string,
      created_at: created_at as number,
    } satisfies Session;
  } catch (e) {
    logger.error(e);
  }
};

const createSession = async (db: Client, userUid: string) => {
  logger.info("Creating a session for", userUid);
  try {
    const token = "authToken123";
    const utcNowSeconds = new Date().getUTCSeconds();

    await db.execute({
      sql: "INSERT INTO sessions (uid, token, created_at) VALUES (?, ?, ?)",
      args: [userUid, token, utcNowSeconds],
    });

    return { token, created_at: utcNowSeconds };
  } catch (e) {
    logger.error(e);
  }
};

const sessionExpired = (session?: Session | null) => {
  if (!session) return true;
  return new Date().getUTCSeconds() - session.created_at > MAX_SESSION_LIFE_SEC;
};

const getUser = async (db: Client, userUid: string) => {
  try {
    const { rows } = await db.execute({
      sql: "SELECT uid, username FROM users WHERE uid = ?",
      args: [userUid],
    });

    const { uid, username } = rows[0];

    return {
      uid: uid as string,
      username: username as string,
    };
  } catch (e) {
    logger.error(e);
  }
};

export const signOut = async (
  db: Client,
  token: string
): Promise<ServerResponse> => {
  try {
    const session = await getSession(db, token);
    if (!session) return { status: 200 };

    await db.execute({
      sql: "DELETE FROM sessions WHERE token = ?",
      args: [token],
    });

    logger.info("Logged out", session.user.username);

    return {
      status: 200,
    };
  } catch (e) {
    logger.error(e);
    return { status: 500, error: e as string };
  }
};
