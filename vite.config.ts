import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import crypto from "node:crypto";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

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

              const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = env;

              if (!cloudName || !apiKey || !apiSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: { message: "Missing Cloudinary env values." } }));
                return;
              }

              const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
              const search = new URLSearchParams({ type: "upload", max_results: "500" });
              if (prefix) search.set("prefix", prefix);

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