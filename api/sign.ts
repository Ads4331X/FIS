import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: { message: "Method not allowed" } });
    return;
  }

  try {
    const body = (req.body ?? {}) as { folder?: string };
    const rawFolder = body.folder ?? "";
    const folder = rawFolder.trim().replace(/^\/+|\/+$/g, "");

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

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign: string[] = [`timestamp=${timestamp}`];
    if (folder) {
      paramsToSign.unshift(`folder=${folder}`);
    }
    const stringToSign = paramsToSign.join("&");
    const signature = crypto
      .createHash("sha1")
      .update(stringToSign + apiSecret)
      .digest("hex");

    res.status(200).json({
      signature,
      timestamp,
      apiKey,
      cloudName,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message:
          error instanceof Error ? error.message : "Failed to generate Cloudinary signature.",
      },
    });
  }
}

