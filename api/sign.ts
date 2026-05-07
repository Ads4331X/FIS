import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

function sanitizeFolderSegment(segment: string): string {
  // lowercase, keep alnum, dash, underscore; collapse whitespace to dash
  const cleaned = segment
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
  return cleaned;
}

function sanitizeFolderPath(input: unknown): string {
  if (typeof input !== "string") return "";
  const normalized = input.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const parts = normalized.split("/").map(sanitizeFolderSegment).filter(Boolean);
  return parts.join("/");
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: { message: "Method not allowed" },
    });
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        error: {
          message:
            "Missing Cloudinary env vars (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)",
        },
      });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const folder = sanitizeFolderPath(req.body?.folder);

    const stringToSign = folder ? `folder=${folder}&timestamp=${timestamp}` : `timestamp=${timestamp}`;

    const signature = crypto
      .createHash("sha1")
      .update(stringToSign + apiSecret)
      .digest("hex");

    return res.status(200).json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (error) {
    return res.status(500).json({
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate signature",
      },
    });
  }
}