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

  const sanitizePrefix = (input: unknown): string => {
    if (typeof input !== "string") return "";
    return input.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
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

  const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  const fetchForPrefix = async (prefix: string) => {
    const search = new URLSearchParams({ type: "upload", max_results: "500" });
    if (prefix) search.set("prefix", prefix);
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?${search.toString()}`;
    const response = await fetch(url, {
      headers: { Authorization: `Basic ${credentials}` },
    });
    const data = await response.json();
    return { status: response.status, data };
  };

  if (uniquePrefixes.length <= 1) {
    const { status, data } = await fetchForPrefix(uniquePrefixes[0] ?? "");
    res.status(status).json(data);
    return;
  }

  const results = await Promise.all(uniquePrefixes.map(fetchForPrefix));
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
    resources: Array.from(resourcesMap.values()),
  });
}