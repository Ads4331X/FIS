import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Keep this in sync with PAGE_SIZE in api/images.ts
  const PAGE_SIZE = "24";

  return {
    plugins: [
      react(),
      {
        name: "local-cloudinary-api",
        configureServer(server) {
          // ── /api/images ─────────────────────────────────────────────────
          server.middlewares.use("/api/images", async (req, res) => {
            try {
              const url = new URL(req.url ?? "", "http://localhost");
              const prefix = (url.searchParams.get("prefix") ?? "")
                .trim()
                .replace(/^\/+|\/+$/g, "");
              const nextCursor = url.searchParams.get("next_cursor") ?? "";

              const {
                CLOUDINARY_CLOUD_NAME: cloudName,
                CLOUDINARY_API_KEY: apiKey,
                CLOUDINARY_API_SECRET: apiSecret,
              } = env;

              if (!cloudName || !apiKey || !apiSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: { message: "Missing Cloudinary env values." },
                  }),
                );
                return;
              }

              const credentials = Buffer.from(
                `${apiKey}:${apiSecret}`,
              ).toString("base64");
              const search = new URLSearchParams({
                type: "upload",
                max_results: PAGE_SIZE,
              });
              if (prefix) search.set("prefix", prefix);
              if (nextCursor) search.set("next_cursor", nextCursor);

              const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?${search.toString()}`;
              const response = await fetch(cloudinaryUrl, {
                headers: { Authorization: `Basic ${credentials}` },
              });
              const data = await response.json();

              res.statusCode = response.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: {
                    message:
                      error instanceof Error
                        ? error.message
                        : "Failed to fetch images.",
                  },
                }),
              );
            }
          });

          // ── /api/auth ────────────────────────────────────────────────────
          server.middlewares.use("/api/auth", async (req, res) => {
            const COOKIE_NAME = "fis_admin_auth";
            const AUTH_TOKEN_TTL_SECONDS = Number(
              env.ADMIN_AUTH_TOKEN_TTL_SECONDS ?? "86400",
            );
            const secure = process.env.NODE_ENV === "production";

            const authSecret = env.ADMIN_AUTH_SECRET?.trim()
              ? env.ADMIN_AUTH_SECRET.trim()
              : crypto
                  .createHash("sha256")
                  .update(
                    `${env.ADMIN_USERNAME ?? ""}:${env.ADMIN_PASSWORD ?? ""}`,
                  )
                  .digest("hex");

            const encodeBase64Url = (value: string | Buffer) =>
              (Buffer.isBuffer(value) ? value : Buffer.from(value))
                .toString("base64")
                .replace(/=/g, "")
                .replace(/\+/g, "-")
                .replace(/\//g, "_");

            const decodeBase64Url = (value: string) => {
              const padded = value + "=".repeat((4 - (value.length % 4)) % 4);
              return Buffer.from(
                padded.replace(/-/g, "+").replace(/_/g, "/"),
                "base64",
              ).toString("utf8");
            };

            const signJwt = (payload: Record<string, unknown>) => {
              const header = encodeBase64Url(
                JSON.stringify({ alg: "HS256", typ: "JWT" }),
              );
              const body = encodeBase64Url(JSON.stringify(payload));
              const signature = encodeBase64Url(
                crypto
                  .createHmac("sha256", authSecret)
                  .update(`${header}.${body}`)
                  .digest(),
              );
              return `${header}.${body}.${signature}`;
            };

            const verifyJwt = (token: string) => {
              const parts = token.split(".");
              if (parts.length !== 3) return null;
              const [header, body, signature] = parts;
              const expected = encodeBase64Url(
                crypto
                  .createHmac("sha256", authSecret)
                  .update(`${header}.${body}`)
                  .digest(),
              );
              // FIX: wrap in Uint8Array to satisfy NodeJS.ArrayBufferView constraint
              const sigBuf = new Uint8Array(Buffer.from(signature));
              const expBuf = new Uint8Array(Buffer.from(expected));
              if (sigBuf.length !== expBuf.length) return null;
              if (!crypto.timingSafeEqual(sigBuf, expBuf)) {
                return null;
              }
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
                return payload as { username: string; exp: number };
              } catch {
                return null;
              }
            };

            const parseCookies = (
              cookieHeader?: string,
            ): Record<string, string> => {
              if (!cookieHeader) return {};
              return cookieHeader
                .split(";")
                .map((cookie) => cookie.split("="))
                .reduce<Record<string, string>>((acc, [name, ...rest]) => {
                  if (!name) return acc;
                  acc[name.trim()] = decodeURIComponent(
                    (rest || []).join("=").trim(),
                  );
                  return acc;
                }, {});
            };

            const buildAuthCookie = (token: string) => {
              const cookieParts = [
                `${COOKIE_NAME}=${token}`,
                "HttpOnly",
                "Path=/",
                "SameSite=Strict",
                `Max-Age=${AUTH_TOKEN_TTL_SECONDS}`,
              ];
              if (secure) cookieParts.push("Secure");
              return cookieParts.join("; ");
            };

            const clearAuthCookie = () => {
              const cookieParts = [
                `${COOKIE_NAME}=; Max-Age=0`,
                "Path=/",
                "HttpOnly",
                "SameSite=Strict",
              ];
              if (secure) cookieParts.push("Secure");
              return cookieParts.join("; ");
            };

            const getUserStorePath = () =>
              env.ADMIN_USERS_FILE?.trim()
                ? path.resolve(env.ADMIN_USERS_FILE.trim())
                : path.join(process.cwd(), "data", "admin-users.json");

            const normalizeUserEntry = (entry: unknown) => {
              if (typeof entry !== "object" || entry === null) return null;
              const raw = entry as Record<string, unknown>;
              const username =
                typeof raw.username === "string" ? raw.username.trim() : "";
              const password =
                typeof raw.password === "string" ? raw.password : "";
              const passwordHash =
                typeof raw.passwordHash === "string" ? raw.passwordHash : "";
              const salt = typeof raw.salt === "string" ? raw.salt : "";
              if (!username) return null;
              if (passwordHash && salt) return { username, passwordHash, salt };
              if (password) {
                const generatedSalt = crypto.randomBytes(16).toString("hex");
                const hash = crypto
                  .scryptSync(password, generatedSalt, 64)
                  .toString("hex");
                return { username, passwordHash: hash, salt: generatedSalt };
              }
              return null;
            };

            const loadStoredUsers = () => {
              try {
                const storePath = getUserStorePath();
                if (!fs.existsSync(storePath)) return [];
                const raw = fs.readFileSync(storePath, "utf8");
                const parsed = JSON.parse(raw);
                if (!Array.isArray(parsed)) return [];
                return parsed.map(normalizeUserEntry).filter(
                  (
                    user,
                  ): user is {
                    username: string;
                    passwordHash: string;
                    salt: string;
                  } => Boolean(user),
                );
              } catch {
                return [];
              }
            };

            const parseAdminUsersEnv = () => {
              try {
                const username = env.ADMIN_USERNAME?.trim();
                const password = env.ADMIN_PASSWORD;
                if (username && password) {
                  const envUser = normalizeUserEntry({ username, password });
                  if (envUser) return [envUser];
                }

                const raw = env.ADMIN_USERS?.trim();
                if (!raw) return [];
                const parsed = JSON.parse(raw);
                if (!Array.isArray(parsed) || parsed.length === 0) return [];
                const envUser = normalizeUserEntry(parsed[0]);
                return envUser ? [envUser] : [];
              } catch {
                return [];
              }
            };

            const getConfiguredUsers = () => {
              const stored = loadStoredUsers();
              if (stored.length > 0) return [stored[0]];
              return parseAdminUsersEnv();
            };

            const getUserByName = (username: string) =>
              getConfiguredUsers().find((user) => user.username === username);

            const verifyPassword = (
              password: string,
              user: { username: string; passwordHash: string; salt: string },
            ) => {
              try {
                const hash = crypto
                  .scryptSync(password, user.salt, 64)
                  .toString("hex");
                // FIX: decode hex strings to bytes before comparing
                const hashBuf = new Uint8Array(Buffer.from(hash, "hex"));
                const storedBuf = new Uint8Array(
                  Buffer.from(user.passwordHash, "hex"),
                );
                if (hashBuf.length !== storedBuf.length) return false;
                return crypto.timingSafeEqual(hashBuf, storedBuf);
              } catch {
                return false;
              }
            };

            const canPersistUserStore = () => {
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
            };

            const saveUserStore = (
              users: Array<{
                username: string;
                passwordHash: string;
                salt: string;
              }>,
            ) => {
              const storePath = getUserStorePath();
              fs.mkdirSync(path.dirname(storePath), { recursive: true });
              fs.writeFileSync(
                storePath,
                JSON.stringify(users, null, 2),
                "utf8",
              );
            };

            const cookies = parseCookies(req.headers.cookie);
            const storedToken = cookies[COOKIE_NAME];

            const failMethod = () => {
              res.statusCode = 405;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ error: { message: "Method not allowed" } }),
              );
            };

            if (req.method === "GET") {
              if (!storedToken) {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({ error: { message: "Not authenticated." } }),
                );
                return;
              }

              const payload = verifyJwt(storedToken);
              if (!payload) {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: { message: "Invalid or expired session." },
                  }),
                );
                return;
              }

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, username: payload.username }));
              return;
            }

            if (req.method === "DELETE") {
              res.setHeader("Set-Cookie", clearAuthCookie());
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true }));
              return;
            }

            if (req.method === "PUT") {
              try {
                const chunks: Buffer[] = [];
                for await (const chunk of req)
                  chunks.push(
                    Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
                  );
                const body = JSON.parse(
                  Buffer.concat(chunks).toString("utf8") || "{}",
                ) as {
                  currentPassword?: string;
                  newPassword?: string;
                  newUsername?: string;
                };

                if (!storedToken) {
                  res.statusCode = 401;
                  res.setHeader("Content-Type", "application/json");
                  res.end(
                    JSON.stringify({
                      error: { message: "Not authenticated." },
                    }),
                  );
                  return;
                }

                const sessionPayload = verifyJwt(storedToken);
                if (!sessionPayload) {
                  res.statusCode = 401;
                  res.setHeader("Content-Type", "application/json");
                  res.end(
                    JSON.stringify({
                      error: { message: "Invalid or expired session." },
                    }),
                  );
                  return;
                }

                const currentPassword = body.currentPassword ?? "";
                const newPassword = body.newPassword?.trim() ?? "";
                const newUsername = body.newUsername?.trim() ?? "";

                if (!currentPassword || (!newPassword && !newUsername)) {
                  res.statusCode = 400;
                  res.setHeader("Content-Type", "application/json");
                  res.end(
                    JSON.stringify({
                      error: {
                        message:
                          "Current password is required, and at least one of new username or new password must be provided.",
                      },
                    }),
                  );
                  return;
                }

                const currentUsername = sessionPayload.username;
                const user = getUserByName(currentUsername);
                if (!user || !verifyPassword(currentPassword, user)) {
                  res.statusCode = 401;
                  res.setHeader("Content-Type", "application/json");
                  res.end(
                    JSON.stringify({
                      error: { message: "Invalid password for current user." },
                    }),
                  );
                  return;
                }

                const desiredUsername = newUsername || currentUsername;
                if (
                  desiredUsername !== currentUsername &&
                  getUserByName(desiredUsername)
                ) {
                  res.statusCode = 409;
                  res.setHeader("Content-Type", "application/json");
                  res.end(
                    JSON.stringify({
                      error: {
                        message: "The requested username is already taken.",
                      },
                    }),
                  );
                  return;
                }

                if (!canPersistUserStore()) {
                  res.statusCode = 501;
                  res.setHeader("Content-Type", "application/json");
                  res.end(
                    JSON.stringify({
                      error: {
                        message:
                          "Password and username changes are not supported in this deployment. Ensure ADMIN_USERS_FILE is configured and writable.",
                      },
                    }),
                  );
                  return;
                }

                const updatedUsers = getConfiguredUsers().map((record) => {
                  if (record.username !== currentUsername) return record;
                  return {
                    username: desiredUsername,
                    passwordHash: newPassword
                      ? crypto
                          .scryptSync(newPassword, record.salt, 64)
                          .toString("hex")
                      : record.passwordHash,
                    salt: record.salt,
                  };
                });
                saveUserStore(updatedUsers);

                const responsePayload = { ok: true, username: desiredUsername };
                if (desiredUsername !== currentUsername) {
                  const refreshedToken = signJwt({
                    username: desiredUsername,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + AUTH_TOKEN_TTL_SECONDS,
                  });
                  res.setHeader("Set-Cookie", buildAuthCookie(refreshedToken));
                }

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(responsePayload));
              } catch {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: {
                      message: "Failed to process authentication request.",
                    },
                  }),
                );
              }
              return;
            }

            if (req.method !== "POST") {
              failMethod();
              return;
            }

            try {
              const chunks: Buffer[] = [];
              for await (const chunk of req)
                chunks.push(
                  Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
                );
              const body = JSON.parse(
                Buffer.concat(chunks).toString("utf8") || "{}",
              ) as {
                username?: string;
                password?: string;
              };

              const {
                ADMIN_USERNAME: adminUsername,
                ADMIN_PASSWORD: adminPassword,
              } = env;
              if (!adminUsername || !adminPassword) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: { message: "Admin credentials are not configured." },
                  }),
                );
                return;
              }

              const username = (body.username ?? "").trim();
              const password = body.password ?? "";
              if (!username || !password) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: { message: "Username and password are required." },
                  }),
                );
                return;
              }

              const user = getUserByName(username);
              if (!user || !verifyPassword(password, user)) {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: { message: "Invalid username or password." },
                  }),
                );
                return;
              }

              const token = signJwt({
                username: user.username,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + AUTH_TOKEN_TTL_SECONDS,
              });
              res.setHeader("Set-Cookie", buildAuthCookie(token));
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ ok: true, username: user.username }));
            } catch {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: {
                    message: "Failed to process authentication request.",
                  },
                }),
              );
            }
          });

          // ── /api/sign ────────────────────────────────────────────────────
          server.middlewares.use("/api/sign", async (req, res) => {
            try {
              if (req.method !== "POST") {
                res.statusCode = 405;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({ error: { message: "Method not allowed" } }),
                );
                return;
              }

              const chunks: Buffer[] = [];
              for await (const chunk of req)
                chunks.push(
                  Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
                );
              const body = JSON.parse(
                Buffer.concat(chunks).toString("utf8") || "{}",
              ) as {
                folder?: string;
                public_id?: string;
                resource_type?: string;
                context?: {
                  title?: string;
                  category?: string;
                  description?: string;
                  createdAt?: string;
                  imageUrl?: string;
                };
              };

              const {
                CLOUDINARY_CLOUD_NAME: cloudName,
                CLOUDINARY_API_KEY: apiKey,
                CLOUDINARY_API_SECRET: apiSecret,
              } = env;
              if (!cloudName || !apiKey || !apiSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: { message: "Missing Cloudinary env vars." },
                  }),
                );
                return;
              }

              const timestamp = Math.round(Date.now() / 1000);
              const folder = (body.folder ?? "")
                .trim()
                .replace(/^\/+|\/+$/g, "");
              const publicId = (body.public_id ?? "")
                .trim()
                .replace(/^\/+|\/+$/g, "");
              const resourceType = (body.resource_type ?? "").trim();

              const contextPairs: Array<[string, string]> = [
                ["title", (body.context?.title ?? "").trim()],
                ["category", (body.context?.category ?? "").trim()],
                ["description", (body.context?.description ?? "").trim()],
                ["createdAt", (body.context?.createdAt ?? "").trim()],
                ["imageUrl", (body.context?.imageUrl ?? "").trim()],
              ];
              const contextEntries = contextPairs.filter(
                (pair): pair is [string, string] => pair[1].length > 0,
              );
              const context = contextEntries
                .map(([k, v]) => `${k}=${v.replace(/[|=]/g, " ")}`)
                .join("|");

              const paramsToSign: Record<string, string> = {
                timestamp: String(timestamp),
              };
              if (folder) paramsToSign.folder = folder;
              if (publicId) paramsToSign.public_id = publicId;
              if (context) paramsToSign.context = context;
              if (resourceType) paramsToSign.resource_type = resourceType;

              const stringToSign = Object.keys(paramsToSign)
                .sort()
                .map((key) => `${key}=${paramsToSign[key]}`)
                .join("&");
              const signature = crypto
                .createHash("sha1")
                .update(stringToSign + apiSecret)
                .digest("hex");

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  signature,
                  timestamp,
                  apiKey,
                  cloudName,
                  folder,
                  public_id: publicId,
                  context,
                  resource_type: resourceType || undefined,
                }),
              );
            } catch (error) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: {
                    message:
                      error instanceof Error
                        ? error.message
                        : "Failed to generate signature.",
                  },
                }),
              );
            }
          });

          // ── /api/notices ─────────────────────────────────────────────────
          server.middlewares.use("/api/notices", async (req, res) => {
            try {
              const url = new URL(req.url ?? "", "http://localhost");
              const nextCursor = url.searchParams.get("next_cursor") ?? "";

              const {
                CLOUDINARY_CLOUD_NAME: cloudName,
                CLOUDINARY_API_KEY: apiKey,
                CLOUDINARY_API_SECRET: apiSecret,
              } = env;

              if (!cloudName || !apiKey || !apiSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: { message: "Missing Cloudinary env values." },
                  }),
                );
                return;
              }

              const credentials = Buffer.from(
                `${apiKey}:${apiSecret}`,
              ).toString("base64");
              const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`;
              const body: Record<string, unknown> = {
                expression: 'asset_folder:"notices" AND type:"upload"',
                max_results: Number(PAGE_SIZE),
                sort_by: [{ created_at: "desc" }],
                with_field: ["context"],
              };
              if (nextCursor) body.next_cursor = nextCursor;

              const response = await fetch(cloudinaryUrl, {
                method: "POST",
                headers: {
                  Authorization: `Basic ${credentials}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
              });
              const data = await response.json();

              res.statusCode = response.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: {
                    message:
                      error instanceof Error
                        ? error.message
                        : "Failed to fetch notices.",
                  },
                }),
              );
            }
          });

          const STORAGE_HEAD_STAFF = path.join(
            process.cwd(),
            "data",
            "head-staff.json",
          );

          const parseBody = async (
            req: import("node:http").IncomingMessage,
          ) => {
            return new Promise<Record<string, unknown> | null>((resolve) => {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk.toString();
              });
              req.on("end", () => {
                try {
                  resolve(body ? JSON.parse(body) : {});
                } catch {
                  resolve(null);
                }
              });
            });
          };

          const readHeadStaff = (): Array<Record<string, unknown>> => {
            try {
              if (!fs.existsSync(STORAGE_HEAD_STAFF)) return [];
              const content = fs.readFileSync(STORAGE_HEAD_STAFF, "utf8");
              const parsed = JSON.parse(content);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          };

          const writeHeadStaff = (items: Array<Record<string, unknown>>) => {
            fs.mkdirSync(path.dirname(STORAGE_HEAD_STAFF), { recursive: true });
            fs.writeFileSync(
              STORAGE_HEAD_STAFF,
              JSON.stringify(items, null, 2),
              "utf8",
            );
          };

          server.middlewares.use("/api/head-staff", async (req, res) => {
            try {
              const url = new URL(req.url ?? "", "http://localhost");
              const pathParts = url.pathname.split("/").filter(Boolean);
              const itemId = pathParts.length > 2 ? pathParts[2] : undefined;
              const method = req.method?.toUpperCase();

              if (method === "GET" && !itemId) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                return res.end(JSON.stringify({ staff: readHeadStaff() }));
              }

              const body = (await parseBody(req)) ?? {};
              const name =
                typeof body.name === "string" ? body.name.trim() : "";
              const position =
                typeof body.position === "string" ? body.position.trim() : "";
              const description =
                typeof body.description === "string"
                  ? body.description.trim()
                  : "";
              const imageUrl =
                typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
              const items = readHeadStaff();

              if (method === "POST" && !itemId) {
                if (!name || !position) {
                  res.statusCode = 400;
                  return res.end(
                    JSON.stringify({
                      error: { message: "Name and position are required." },
                    }),
                  );
                }
                const record = {
                  id: crypto.randomBytes(8).toString("hex"),
                  name,
                  position,
                  description,
                  imageUrl,
                };
                items.unshift(record);
                writeHeadStaff(items);
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                return res.end(JSON.stringify(record));
              }

              if (itemId && method === "PUT") {
                const index = items.findIndex((item) => item.id === itemId);
                if (index === -1) {
                  res.statusCode = 404;
                  res.setHeader("Content-Type", "application/json");
                  return res.end(
                    JSON.stringify({
                      error: { message: "Staff member not found." },
                    }),
                  );
                }
                if (!name || !position) {
                  res.statusCode = 400;
                  res.setHeader("Content-Type", "application/json");
                  return res.end(
                    JSON.stringify({
                      error: { message: "Name and position are required." },
                    }),
                  );
                }
                items[index] = {
                  id: itemId,
                  name,
                  position,
                  description,
                  imageUrl,
                };
                writeHeadStaff(items);
                res.setHeader("Content-Type", "application/json");
                return res.end(JSON.stringify(items[index]));
              }

              if (itemId && method === "DELETE") {
                const next = items.filter((item) => item.id !== itemId);
                writeHeadStaff(next);
                res.setHeader("Content-Type", "application/json");
                return res.end(JSON.stringify({ ok: true }));
              }

              res.setHeader("Allow", "GET, POST, PUT, DELETE");
              res.statusCode = 405;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ error: { message: "Method not allowed." } }),
              );
            } catch (error) {
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  error: {
                    message:
                      error instanceof Error
                        ? error.message
                        : "Failed to load head staff.",
                  },
                }),
              );
            }
          });

          // ── /api/delete ──────────────────────────────────────────────────
          server.middlewares.use("/api/delete", async (req, res) => {
            try {
              if (req.method !== "POST") {
                res.statusCode = 405;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({ error: { message: "Method not allowed" } }),
                );
                return;
              }

              const chunks: Buffer[] = [];
              for await (const chunk of req)
                chunks.push(
                  Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk),
                );
              const body = JSON.parse(
                Buffer.concat(chunks).toString("utf8") || "{}",
              ) as {
                public_id?: string;
                publicId?: string;
                resource_type?: string;
                resourceType?: string;
              };

              const publicId = (body.public_id ?? body.publicId)?.trim();
              const requestedType =
                (body.resource_type ?? body.resourceType)
                  ?.trim()
                  .toLowerCase() === "raw"
                  ? "raw"
                  : "image";
              if (!publicId) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: { message: "public_id is required." },
                  }),
                );
                return;
              }

              const {
                CLOUDINARY_CLOUD_NAME: cloudName,
                CLOUDINARY_API_KEY: apiKey,
                CLOUDINARY_API_SECRET: apiSecret,
              } = env;
              if (!cloudName || !apiKey || !apiSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: { message: "Missing Cloudinary env vars." },
                  }),
                );
                return;
              }

              const candidatePublicIds = Array.from(
                new Set(
                  publicId.endsWith(".json")
                    ? [publicId, publicId.replace(/\.json$/i, "")]
                    : [publicId, `${publicId}.json`],
                ),
              );
              const resourceTypes: Array<"image" | "raw"> = [
                requestedType,
                requestedType === "image" ? "raw" : "image",
              ];

              const destroyAsset = async (
                candidateId: string,
                resourceType: "image" | "raw",
              ) => {
                const timestamp = Math.round(Date.now() / 1000);
                const paramsToSign: Record<string, string> = {
                  public_id: candidateId,
                  timestamp: String(timestamp),
                };
                const stringToSign = Object.keys(paramsToSign)
                  .sort()
                  .map((key) => `${key}=${paramsToSign[key]}`)
                  .join("&");
                const signature = crypto
                  .createHash("sha1")
                  .update(stringToSign + apiSecret)
                  .digest("hex");

                const form = new URLSearchParams({
                  public_id: candidateId,
                  resource_type: resourceType,
                  api_key: apiKey,
                  timestamp: String(timestamp),
                  signature,
                });

                const response = await fetch(
                  `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: form.toString(),
                  },
                );
                const data = (await response.json().catch(() => ({}))) as {
                  result?: string;
                  error?: { message?: string };
                };
                return { result: data.result, message: data.error?.message };
              };

              let sawNotFound = false;
              let lastError = "Delete failed.";

              for (const type of resourceTypes) {
                for (const candidateId of candidatePublicIds) {
                  const out = await destroyAsset(candidateId, type);
                  if (out.result === "ok") {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ ok: true }));
                    return;
                  }
                  if (out.result === "not found") {
                    sawNotFound = true;
                    continue;
                  }
                  if (out.message) lastError = out.message;
                }
              }

              if (
                sawNotFound ||
                lastError.trim().toLowerCase().includes("not found")
              ) {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: true, result: "not found" }));
                return;
              }

              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: { message: lastError } }));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: {
                    message:
                      error instanceof Error ? error.message : "Delete failed.",
                  },
                }),
              );
            }
          });
        },
      },
    ],
  };
});
