import type { VercelRequest, VercelResponse } from "@vercel/node";

const PAGE_SIZE = 24;
const NOTICE_FOLDER = "notices";

type CloudinaryEnv = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

type CloudinaryError = {
  error?: {
    message?: string;
  };
};

type CloudinarySearchResponse = CloudinaryError & {
  resources?: unknown[];
  next_cursor?: string;
};

function setCorsHeaders(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getCloudinaryEnv(): CloudinaryEnv | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

function getFirstQueryValue(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}

function getNextCursor(req: VercelRequest): string | undefined {
  const cursor = getFirstQueryValue(req.query.next_cursor).trim();
  return cursor.length > 0 ? cursor : undefined;
}

function buildSearchBody(nextCursor?: string): Record<string, unknown> {
  const body: Record<string, unknown> = {
    expression: `asset_folder:"${NOTICE_FOLDER}" AND type:"upload"`,
    max_results: PAGE_SIZE,
    sort_by: [{ created_at: "desc" }],
    with_field: ["context"],
  };

  if (nextCursor) {
    body.next_cursor = nextCursor;
  }

  return body;
}

async function readCloudinaryJson(response: Response): Promise<CloudinarySearchResponse> {
  const data: unknown = await response.json().catch(() => ({}));
  return data && typeof data === "object" ? (data as CloudinarySearchResponse) : {};
}

function getCloudinaryErrorMessage(data: CloudinaryError): string {
  return data.error?.message ?? "Failed to fetch notices from Cloudinary.";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    res.status(405).json({ error: { message: "Method not allowed" } });
    return;
  }

  try {
    const env = getCloudinaryEnv();

    if (!env) {
      res.status(500).json({
        error: {
          message:
            "Missing Cloudinary env values. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        },
      });
      return;
    }

    const credentials = Buffer.from(`${env.apiKey}:${env.apiSecret}`).toString("base64");
    const url = `https://api.cloudinary.com/v1_1/${env.cloudName}/resources/search`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildSearchBody(getNextCursor(req))),
    });
    const data = await readCloudinaryJson(response);

    if (!response.ok) {
      res.status(response.status).json({
        error: { message: getCloudinaryErrorMessage(data) },
      });
      return;
    }

    res.status(200).json({
      ...data,
      resources: Array.isArray(data.resources) ? data.resources : [],
      next_cursor:
        typeof data.next_cursor === "string" && data.next_cursor.trim()
          ? data.next_cursor
          : undefined,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        message:
          error instanceof Error ? error.message : "Failed to fetch notices from Cloudinary.",
      },
    });
  }
}
