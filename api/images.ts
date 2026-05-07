import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({
      error: {
        message:
          "Missing Cloudinary env values. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      },
    });
    return;
  }

  const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const search = new URLSearchParams({ type: "upload", max_results: "100" });
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?${search.toString()}`;
  const response = await fetch(url, {
    headers: { Authorization: `Basic ${credentials}` },
  });
  const data = await response.json();
  res.status(response.status).json(data);
}