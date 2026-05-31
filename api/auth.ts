import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import fs from "fs";
import path from "path";

type UserRecord = {
  username: string;
  passwordHash: string;
  salt: string;
};

type AuthRequestBody = {
  username?: string;
  password?: string;
  currentPassword?: string;
  newPassword?: string;
};

const COOKIE_NAME = "fis_admin_auth";
const AUTH_TOKEN_TTL_SECONDS = Number(
  process.env.ADMIN_AUTH_TOKEN_TTL_SECONDS ?? "86400",
);
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 60 * 60 * 1000;
const failedAttempts = new Map<
  string,
  { count: number; firstAttempt: number; lockedUntil: number }
>();

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket.remoteAddress ?? "unknown";
}

function safeCompare(a: string, b: string): boolean {
  const aBytes = Buffer.from(a);
  const bBytes = Buffer.from(b);
  if (aBytes.length !== bBytes.length) return false;
  return crypto.timingSafeEqual(aBytes, bBytes);
}

function getAuthSecret(): string {
  const envSecret = process.env.ADMIN_AUTH_SECRET?.trim();
  if (envSecret) return envSecret;

  const users = getConfiguredUsers();
  const fallback = users
    .map((user) => `${user.username}:${user.passwordHash}:${user.salt}`)
    .join("|");

  return crypto
    .createHash("sha256")
    .update(fallback || "fis-admin-auth-secret")
    .digest("hex");
}

function encodeBase64Url(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function decodeBase64Url(value: string) {
  const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
  return Buffer.from(
    padded.replace(/-/g, "+").replace(/_/g, "/"),
    "base64",
  ).toString("utf8");
}

function signJwt(payload: Record<string, unknown>, secret: string) {
  const header = encodeBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = encodeBase64Url(JSON.stringify(payload));
  const signature = encodeBase64Url(
    crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest(),
  );
  return `${header}.${body}.${signature}`;
}

function verifyJwt(
  token: string,
  secret: string,
): { username: string; exp: number } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expected = encodeBase64Url(
    crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest(),
  );
  if (!safeCompare(signature, expected)) return null;

  try {
    const payload = JSON.parse(decodeBase64Url(body));
    if (
      typeof payload !== "object" ||
      payload === null ||
      typeof payload.username !== "string" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function getUserStorePath(): string {
  return process.env.ADMIN_USERS_FILE?.trim()
    ? path.resolve(process.env.ADMIN_USERS_FILE.trim())
    : path.join(process.cwd(), "data", "admin-users.json");
}

function normalizeUserEntry(entry: unknown): UserRecord | null {
  if (typeof entry !== "object" || entry === null) return null;
  const raw = entry as Record<string, unknown>;
  const username = typeof raw.username === "string" ? raw.username.trim() : "";
  const password = typeof raw.password === "string" ? raw.password : "";
  const passwordHash =
    typeof raw.passwordHash === "string" ? raw.passwordHash : "";
  const salt = typeof raw.salt === "string" ? raw.salt : "";
  if (!username) return null;
  if (passwordHash && salt) {
    return { username, passwordHash, salt };
  }
  if (password) {
    const generatedSalt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, generatedSalt, 64).toString("hex");
    return { username, passwordHash: hash, salt: generatedSalt };
  }
  return null;
}

function loadStoredUsers(): UserRecord[] {
  try {
    const storePath = getUserStorePath();
    if (!fs.existsSync(storePath)) return [];
    const raw = fs.readFileSync(storePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeUserEntry)
      .filter((user): user is UserRecord => Boolean(user));
  } catch {
    return [];
  }
}

function parseAdminUsersEnv(): UserRecord[] {
  try {
    const raw = process.env.ADMIN_USERS?.trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeUserEntry)
      .filter((user): user is UserRecord => Boolean(user));
  } catch {
    return [];
  }
}

function getConfiguredUsers(): UserRecord[] {
  const stored = loadStoredUsers();
  if (stored.length > 0) return stored;

  const envUsers = parseAdminUsersEnv();
  if (envUsers.length > 0) return envUsers;

  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (username && password) {
    return [normalizeUserEntry({ username, password })!];
  }

  return [];
}

function getUserByName(username: string): UserRecord | undefined {
  return getConfiguredUsers().find((user) => user.username === username);
}

function verifyPassword(password: string, user: UserRecord): boolean {
  try {
    const hash = crypto.scryptSync(password, user.salt, 64).toString("hex");
    return safeCompare(hash, user.passwordHash);
  } catch {
    return false;
  }
}

function canPersistUserStore(): boolean {
  try {
    const storePath = getUserStorePath();
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    if (!fs.existsSync(storePath)) {
      fs.writeFileSync(storePath, "[]", "utf8");
    }
    fs.accessSync(storePath, fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function saveUserStore(users: UserRecord[]): void {
  const storePath = getUserStorePath();
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(users, null, 2), "utf8");
}

function getRateLimitState(key: string) {
  const now = Date.now();
  const state = failedAttempts.get(key);
  if (!state) {
    const next = { count: 0, firstAttempt: now, lockedUntil: 0 };
    failedAttempts.set(key, next);
    return next;
  }

  if (state.lockedUntil > now) {
    return state;
  }

  if (now - state.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    state.count = 0;
    state.firstAttempt = now;
    state.lockedUntil = 0;
  }

  return state;
}

function incrementFailedAttempt(key: string) {
  const state = getRateLimitState(key);
  state.count += 1;
  if (state.count >= MAX_FAILED_ATTEMPTS) {
    state.lockedUntil = Date.now() + LOCKOUT_WINDOW_MS;
  }
  failedAttempts.set(key, state);
}

function getRetryAfterSeconds(key: string): number {
  const state = failedAttempts.get(key);
  if (!state) return 0;
  const remaining = state.lockedUntil - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

function buildAuthCookie(token: string) {
  const secure = process.env.NODE_ENV === "production";
  const cookieParts = [
    `${COOKIE_NAME}=${token}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Strict",
    `Max-Age=${AUTH_TOKEN_TTL_SECONDS}`,
  ];
  if (secure) cookieParts.push("Secure");
  return cookieParts.join("; ");
}

function clearAuthCookie() {
  const secure = process.env.NODE_ENV === "production";
  const cookieParts = [
    `${COOKIE_NAME}=; Max-Age=0`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
  ];
  if (secure) cookieParts.push("Secure");
  return cookieParts.join("; ");
}

function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.split("="))
    .reduce<Record<string, string>>((acc, [name, ...rest]) => {
      if (!name) return acc;
      acc[name.trim()] = decodeURIComponent((rest || []).join("=").trim());
      return acc;
    }, {});
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const users = getConfiguredUsers();
  if (users.length === 0) {
    res.status(500).json({
      error: { message: "Admin credentials are not configured on the server." },
    });
    return;
  }

  const clientIp = getClientIp(req);
  const rateLimitState = getRateLimitState(clientIp);
  if (rateLimitState.lockedUntil > Date.now()) {
    const retryAfter = getRetryAfterSeconds(clientIp);
    res.setHeader("Retry-After", String(retryAfter));
    res.status(429).json({
      error: {
        message: "Too many failed login attempts. Try again later.",
      },
    });
    return;
  }

  const authSecret = getAuthSecret(process.env.ADMIN_PASSWORD ?? "");
  const cookies = parseCookies(req.headers.cookie);
  const storedToken = cookies[COOKIE_NAME];

  if (req.method === "GET") {
    if (!storedToken) {
      res.status(401).json({ error: { message: "Not authenticated." } });
      return;
    }

    const payload = verifyJwt(storedToken, authSecret);
    if (!payload) {
      res
        .status(401)
        .json({ error: { message: "Invalid or expired session." } });
      return;
    }

    res.status(200).json({ ok: true, username: payload.username });
    return;
  }

  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", clearAuthCookie());
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method === "PUT") {
    const body = (req.body ?? {}) as AuthRequestBody;
    const username = (body.username ?? "").trim();
    const currentPassword = body.currentPassword ?? "";
    const newPassword = body.newPassword ?? "";

    if (!username || !currentPassword || !newPassword) {
      res.status(400).json({
        error: {
          message: "Username, current password, and new password are required.",
        },
      });
      return;
    }

    const user = getUserByName(username);
    if (!user || !verifyPassword(currentPassword, user)) {
      incrementFailedAttempt(clientIp);
      res
        .status(401)
        .json({ error: { message: "Invalid username or password." } });
      return;
    }

    if (!canPersistUserStore()) {
      res.status(501).json({
        error: {
          message:
            "Password changes are not supported in this deployment. Ensure the server can write to the admin users file path.",
        },
      });
      return;
    }

    const updatedUsers = getConfiguredUsers().map((record) =>
      record.username === username
        ? {
            username,
            passwordHash: crypto
              .scryptSync(newPassword, record.salt, 64)
              .toString("hex"),
            salt: record.salt,
          }
        : record,
    );
    saveUserStore(updatedUsers);
    res
      .status(200)
      .json({ ok: true, message: "Password updated successfully." });
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST, PUT, DELETE");
    res.status(405).json({ error: { message: "Method not allowed." } });
    return;
  }

  try {
    const body = (req.body ?? {}) as AuthRequestBody;
    const username = (body.username ?? "").trim();
    const password = body.password ?? "";

    if (!username || !password) {
      res.status(400).json({
        error: { message: "Username and password are required." },
      });
      return;
    }

    const user = getUserByName(username);
    if (!user || !verifyPassword(password, user)) {
      incrementFailedAttempt(clientIp);
      res
        .status(401)
        .json({ error: { message: "Invalid username or password." } });
      return;
    }

    failedAttempts.delete(clientIp);

    const token = signJwt(
      {
        username: user.username,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + AUTH_TOKEN_TTL_SECONDS,
      },
      authSecret,
    );

    res.setHeader("Set-Cookie", buildAuthCookie(token));
    res.status(200).json({ ok: true, username: user.username });
  } catch (error) {
    res.status(500).json({
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to process authentication request.",
      },
    });
  }
}
