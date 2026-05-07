import type { VercelRequest, VercelResponse } from "@vercel/node";

type DeleteRequestBody = {
  public_id?: string;
  resource_type?: string;
};

function normalizeResourceType(value: unknown): "image" | "raw" {
  return typeof value === "string" && value.trim().toLowerCase() === "raw" ? "raw" : "image";
}

async function deleteCloudinaryAsset(
  cloudName: string,
  apiKey: string,
  apiSecret: string,
  publicId: string,
  resourceType: "image" | "raw",
): Promise<{ deleted: boolean; notFound: boolean; message?: string }> {
  const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const encodedPublicId = encodeURIComponent(publicId);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/${resourceType}/upload/${encodedPublicId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  const rawBody = await response.text().catch(() => "");
  let data = {} as {
    result?: string;
    deleted?: Record<string, string>;
    error?: { message?: string };
    message?: string;
  };
  if (rawBody) {
    try {
      data = JSON.parse(rawBody) as typeof data;
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    const message = data.error?.message ?? data.message ?? rawBody || "Delete failed.";
    const lowered = message.toLowerCase();
    if (lowered.includes("not found") || lowered.includes("can't find resource")) {
      return { deleted: false, notFound: true };
    }
    return {
      deleted: false,
      notFound: false,
      message,
    };
  }

  if (data.result === "ok") return { deleted: true, notFound: false };
  if (data.result === "not found") return { deleted: false, notFound: true };

  const status = data.deleted?.[publicId];
  if (status === "deleted") return { deleted: true, notFound: false };
  if (status === "not_found") return { deleted: false, notFound: true };
  // Some Cloudinary admin delete responses are 200 with sparse/empty payload.
  if (response.ok) return { deleted: true, notFound: false };
  return { deleted: false, notFound: false, message: "Delete failed." };
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

  const body = (req.body ?? {}) as DeleteRequestBody;
  const publicId = body.public_id?.trim();
  const resourceType = normalizeResourceType(body.resource_type);

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
          cloudName,
          apiKey,
          apiSecret,
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

    res.status(400).json({ error: { message: lastError } });
  } catch (error) {
    res.status(500).json({
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete image.",
      },
    });
  }
}