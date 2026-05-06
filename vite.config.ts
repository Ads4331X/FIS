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

              const cloudName = env.CLOUDINARY_CLOUD_NAME || env.VITE_CLOUDINARY_CLOUD_NAME;
              const apiKey = env.CLOUDINARY_API_KEY || env.VITE_CLOUDINARY_API_KEY;
              const apiSecret = env.CLOUDINARY_API_SECRET || env.VITE_CLOUDINARY_API_SECRET;

              if (!cloudName || !apiKey || !apiSecret) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: {
                      message:
                        "Missing Cloudinary env values. Set CLOUDINARY_CLOUD_NAME (or VITE_CLOUDINARY_CLOUD_NAME), CLOUDINARY_API_KEY (or VITE_CLOUDINARY_API_KEY), and CLOUDINARY_API_SECRET (or VITE_CLOUDINARY_API_SECRET).",
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
        },
      },
    ],
  };
});