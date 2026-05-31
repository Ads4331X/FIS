import type { VercelRequest, VercelResponse } from "@vercel/node";

const PAGE_SIZE = 24;

function normalizeOrigin(origin: unknown): string {
  return typeof origin === "string" ? origin.trim() : "";
}

function isOriginAllowed(origin: string, host: string): boolean {
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const sameOriginHosts = host ? [`http://${host}`, `https://${host}`] : [];

  return sameOriginHosts.includes(origin) || allowedOrigins.includes(origin);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = normalizeOrigin(req.headers.origin);
  const host = typeof req.headers.host === "string" ? req.headers.host : "";

  if (origin && isOriginAllowed(origin, host)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

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

  const sanitizePrefix = (input: unknown): string => {
    if (typeof input !== "string") return "";
    return input
      .trim()
      .replace(/\\/g, "/")
      .replace(/^\/+|\/+$/g, "");
  };

  // Accept optional ?prefix= query param for folder filtering.
  // Supports repeated query params: /api/images?prefix=students&prefix=School/Students
  const prefixesRaw = req.query.prefix;
  const prefixes =
    typeof prefixesRaw === "string"
      ? [sanitizePrefix(prefixesRaw)]
      : Array.isArray(prefixesRaw)
        ? prefixesRaw.map(sanitizePrefix)
        : [];
  const uniquePrefixes = Array.from(new Set(prefixes.filter(Boolean)));

  // Optional pagination cursor from client.
  const nextCursorRaw = req.query.next_cursor;
  const nextCursor =
    typeof nextCursorRaw === "string"
      ? nextCursorRaw
      : Array.isArray(nextCursorRaw)
        ? nextCursorRaw[0]
        : undefined;

  const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  const fetchForPrefix = async (prefix: string, cursor?: string) => {
    const search = new URLSearchParams({
      type: "upload",
      max_results: String(PAGE_SIZE),
    });
    if (prefix) search.set("prefix", prefix);
    if (cursor) search.set("next_cursor", cursor);

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?${search.toString()}`;
    const response = await fetch(url, {
      headers: { Authorization: `Basic ${credentials}` },
    });
    const data = await response.json();
    return { status: response.status, data };
  };

  // Single prefix (or "all images") – allow Cloudinary pagination to work as-is.
  if (uniquePrefixes.length <= 1) {
    const { status, data } = await fetchForPrefix(
      uniquePrefixes[0] ?? "",
      nextCursor,
    );
    res.status(status).json(data);
    return;
  }

  // Multiple prefixes – fetch one page per prefix and merge resources.
  // Pagination via next_cursor is not supported for this merged view.
  const results = await Promise.all(
    uniquePrefixes.map((p) => fetchForPrefix(p)),
  );
  const firstNon200 = results.find((r) => r.status >= 400);
  if (firstNon200) {
    res.status(firstNon200.status).json(firstNon200.data);
    return;
  }

  // Merge resources by public_id
  const resourcesMap = new Map<string, any>();
  for (const r of results) {
    const resources = Array.isArray(r.data?.resources) ? r.data.resources : [];
    for (const item of resources) {
      const id = typeof item?.public_id === "string" ? item.public_id : "";
      if (id && !resourcesMap.has(id)) resourcesMap.set(id, item);
    }
  }

  res.status(200).json({
    ...results[0].data,
    next_cursor: undefined,
    resources: Array.from(resourcesMap.values()),
  });
}
