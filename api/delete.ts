import type { VercelRequest, VercelResponse } from "@vercel/node";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type DeleteRequestBody = {
  public_id?: string;
  publicId?: string;
  resource_type?: string;
  resourceType?: string;
};

function normalizeResourceType(value: unknown): "image" | "raw" {
  return typeof value === "string" && value.trim().toLowerCase() === "raw" ? "raw" : "image";
}

function isNotFoundMessage(message: string): boolean {
  const lowered = message.trim().toLowerCase();
  return (
    lowered.includes("not found") ||
    lowered.includes("not_found") ||
    lowered.includes("can't find resource") ||
    lowered.includes("does not exist")
  );
}

function parseDeleteRequestBody(rawBody: unknown): DeleteRequestBody {
  if (!rawBody) return {};
  if (typeof rawBody === "string") {
    try {
      const parsed = JSON.parse(rawBody) as DeleteRequestBody;
      return parsed ?? {};
    } catch {
      return {};
    }
  }
  if (typeof rawBody === "object") {
    return rawBody as DeleteRequestBody;
  }
  return {};
}

async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: "image" | "raw",
): Promise<{
  deleted: boolean;
  notFound: boolean;
  message?: string;
}> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    if (result.result === "ok") {
      return { deleted: true, notFound: false };
    }

    if (result.result === "not found") {
      return { deleted: false, notFound: true };
    }

    return {
      deleted: false,
      notFound: false,
      message: "Delete failed.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed.";
    if (isNotFoundMessage(message)) {
      return { deleted: false, notFound: true };
    }
    return {
      deleted: false,
      notFound: false,
      message,
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: { message: "Method not allowed" } });
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    res.status(500).json({
      error: { message: "Missing Cloudinary env vars." },
    });
    return;
  }

  const body = parseDeleteRequestBody(req.body);
  const publicId = (body.public_id ?? body.publicId)?.trim();
  const resourceType = normalizeResourceType(body.resource_type ?? body.resourceType);

  console.log("Deleting public_id:", publicId);

  if (!publicId) {
    res.status(400).json({ error: { message: "public_id is required." } });
    return;
  }

  try {
    const fallbackResourceType: "image" | "raw" = resourceType === "image" ? "raw" : "image";
    const candidatePublicIds = Array.from(
      new Set(publicId.endsWith(".json") ? [publicId, publicId.replace(/\.json$/i, "")] : [publicId]),
    );
    const resourceTypes: Array<"image" | "raw"> = [resourceType, fallbackResourceType];

    let sawNotFound = false;
    let lastError = "Delete failed.";

    for (const type of resourceTypes) {
      for (const candidateId of candidatePublicIds) {
        const result = await deleteCloudinaryAsset(
          candidateId,
          type,
        );

        if (result.deleted) {
          res.status(200).json({ ok: true });
          return;
        }

        if (result.notFound) {
          sawNotFound = true;
          continue;
        }

        if (result.message) {
          lastError = result.message;
        }
      }
    }

    if (sawNotFound) {
      // Treat as success so admin can remove stale/local records safely.
      res.status(200).json({ ok: true, result: "not found" });
      return;
    }

    if (isNotFoundMessage(lastError)) {
      // Some SDK responses can bubble "not found" as a plain message.
      res.status(200).json({ ok: true, result: "not found" });
      return;
    }

    res.status(400).json({
      error: {
        message: lastError,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete image.",
      },
    });
  }
}