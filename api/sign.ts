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

function toSafeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncateValue(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength).trimEnd();
}

function buildContextString(input: unknown): string {
  if (!input || typeof input !== "object") return "";
  const raw = input as {
    public_id?: unknown;
    title?: unknown;
    category?: unknown;
    description?: unknown;
    createdAt?: unknown;
    imageUrl?: unknown;
  };

  const entries: Array<[string, string]> = [
    ["title", truncateValue(normalizeWhitespace(toSafeString(raw.title)), 90)],
    ["category", truncateValue(normalizeWhitespace(toSafeString(raw.category)), 40)],
    ["description", truncateValue(normalizeWhitespace(toSafeString(raw.description)), 120)],
    ["createdAt", truncateValue(normalizeWhitespace(toSafeString(raw.createdAt)), 35)],
    ["imageUrl", truncateValue(normalizeWhitespace(toSafeString(raw.imageUrl)), 220)],
  ].filter(([, value]) => value.length > 0);

  const context = entries.map(([k, v]) => `${k}=${v.replace(/[|=]/g, " ")}`).join("|");
  // Cloudinary context has practical size limits; keep below common thresholds.
  return truncateValue(context, 350);
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
    const publicId = sanitizeFolderPath(req.body?.public_id);
    const context = buildContextString(req.body?.context);
    const resourceType = toSafeString(req.body?.resource_type);

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

    return res.status(200).json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
      public_id: publicId,
      context,
      resource_type: resourceType || undefined,
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