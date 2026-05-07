import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

function normalizeRootFolder(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean)
    .pop() ?? "";
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
    const folder = normalizeRootFolder(req.body?.folder);

    // Force uploads to a single root folder (no nested paths).
    const stringToSign = folder
      ? `folder=${folder}&timestamp=${timestamp}`
      : `timestamp=${timestamp}`;

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