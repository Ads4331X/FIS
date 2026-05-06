import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      {
        name: "local-cloudinary-api",
        configureServer(server) {
          server.middlewares.use("/api/images", async (req, res) => {
            try {
              const url = new URL(req.url || "", "http://localhost");
              const rawFolder = url.searchParams.get("folder") ?? url.searchParams.get("prefix") ?? "";
              const folder = rawFolder.trim().replace(/^\/+|\/+$/g, "");

              const cloudName = env.CLOUDINARY_CLOUD_NAME;
              const apiKey = env.CLOUDINARY_API_KEY;
              const apiSecret = env.CLOUDINARY_API_SECRET;

              if (!cloudName || !apiKey || !apiSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: {
                      message:
                        "Missing Cloudinary env values. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
                    },
                  })
                );
                return;
              }

              const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
              const search = new URLSearchParams({
                type: "upload",
                max_results: "100",
              });
              if (folder) search.set("prefix", folder);

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
                        : "Failed to fetch images from Cloudinary.",
                  },
                })
              );
            }
          });

          // Local dev: emulate Vercel serverless `api/auth.ts`
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

              const adminUsername = env.ADMIN_USERNAME;
              const adminPassword = env.ADMIN_PASSWORD;
              if (!adminUsername || !adminPassword) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: { message: "Admin credentials are not configured on the server." },
                  })
                );
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
        },
      },
    ],
  };
});