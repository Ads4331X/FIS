import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import crypto from "node:crypto";

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
              const prefix = (url.searchParams.get("prefix") ?? "").trim().replace(/^\/+|\/+$/g, "");
              const nextCursor = url.searchParams.get("next_cursor") ?? "";

              const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = env;

              if (!cloudName || !apiKey || !apiSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: { message: "Missing Cloudinary env values." } }));
                return;
              }

              const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
              const search = new URLSearchParams({ type: "upload", max_results: PAGE_SIZE });
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
              res.end(JSON.stringify({ error: { message: error instanceof Error ? error.message : "Failed to fetch images." } }));
            }
          });

          // ── /api/auth ────────────────────────────────────────────────────
          server.middlewares.use("/api/auth", async (req, res) => {
            try {
              if (req.method !== "POST") {
                res.statusCode = 405;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: { message: "Method not allowed" } }));
                return;
              }

              const chunks: Buffer[] = [];
              for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
              const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") as {
                username?: string;
                password?: string;
              };

              const { ADMIN_USERNAME: adminUsername, ADMIN_PASSWORD: adminPassword } = env;
              if (!adminUsername || !adminPassword) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: { message: "Admin credentials are not configured." } }));
                return;
              }

              const ok = body.username === adminUsername && body.password === adminPassword;
              res.statusCode = ok ? 200 : 401;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(ok ? { ok: true } : { error: { message: "Invalid username or password." } }));
            } catch {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: { message: "Failed to process authentication request." } }));
            }
          });

          // ── /api/sign ────────────────────────────────────────────────────
          server.middlewares.use("/api/sign", async (req, res) => {
            try {
              if (req.method !== "POST") {
                res.statusCode = 405;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: { message: "Method not allowed" } }));
                return;
              }

              const chunks: Buffer[] = [];
              for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
              const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") as {
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

              const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = env;
              if (!cloudName || !apiKey || !apiSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: { message: "Missing Cloudinary env vars." } }));
                return;
              }

              const timestamp = Math.round(Date.now() / 1000);
              const folder = (body.folder ?? "").trim().replace(/^\/+|\/+$/g, "");
              const publicId = (body.public_id ?? "").trim().replace(/^\/+|\/+$/g, "");
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
              const signature = crypto.createHash("sha1").update(stringToSign + apiSecret).digest("hex");

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
                })
              );
            } catch (error) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: { message: error instanceof Error ? error.message : "Failed to generate signature." } }));
            }
          });

          // ── /api/notices ─────────────────────────────────────────────────
          server.middlewares.use("/api/notices", async (req, res) => {
            try {
              const url = new URL(req.url ?? "", "http://localhost");
              const nextCursor = url.searchParams.get("next_cursor") ?? "";

              const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = env;

              if (!cloudName || !apiKey || !apiSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: { message: "Missing Cloudinary env values." } }));
                return;
              }

              const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
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
              res.end(JSON.stringify({ error: { message: error instanceof Error ? error.message : "Failed to fetch notices." } }));
            }
          });

          // ── /api/delete ──────────────────────────────────────────────────
          server.middlewares.use("/api/delete", async (req, res) => {
            try {
              if (req.method !== "POST") {
                res.statusCode = 405;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: { message: "Method not allowed" } }));
                return;
              }

              const chunks: Buffer[] = [];
              for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
              const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}") as {
                public_id?: string;
              };

              const publicId = body.public_id?.trim();
              if (!publicId) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: { message: "public_id is required." } }));
                return;
              }

              const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = env;
              if (!cloudName || !apiKey || !apiSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: { message: "Missing Cloudinary env vars." } }));
                return;
              }

              const timestamp = Math.round(Date.now() / 1000);
              const stringToSign = `public_id=${publicId}&timestamp=${timestamp}`;
              const signature = crypto.createHash("sha1").update(stringToSign + apiSecret).digest("hex");

              const form = new URLSearchParams({
                public_id: publicId,
                api_key: apiKey,
                timestamp: String(timestamp),
                signature,
              });

              const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/x-www-form-urlencoded" },
                  body: form.toString(),
                }
              );

              const data = await response.json() as { result?: string };
              if (data.result === "ok") {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: true }));
              } else {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: { message: data.result ?? "Delete failed." } }));
              }
            } catch (error) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: { message: error instanceof Error ? error.message : "Delete failed." } }));
            }
          });
        },
      },
    ],
  };
});