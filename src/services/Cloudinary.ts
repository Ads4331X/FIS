const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

export type GalleryImage = {
  public_id: string;
  secure_url: string;
  folder: string;
  display_name?: string;
  created_at: string;
  width: number;
  height: number;
  bytes?: number;
  resource_type?: string;
  format?: string;
};

export type NoticeAsset = {
  public_id: string;
  secure_url: string;
  created_at: string;
  resource_type: string;
  format?: string;
  context?: {
    custom?:
      | {
          title?: string;
          category?: string;
          description?: string;
          createdAt?: string;
          imageUrl?: string;
        }
      | string;
    title?: string;
    category?: string;
    description?: string;
    createdAt?: string;
    imageUrl?: string;
  };
};

type NoticeContextValues = {
  title?: string;
  category?: string;
  description?: string;
  createdAt?: string;
  imageUrl?: string;
};

function parseCloudinaryContextString(contextString: string): NoticeContextValues {
  return contextString.split("|").reduce<NoticeContextValues>((acc, entry) => {
    const [rawKey, ...rawValueParts] = entry.split("=");
    const key = rawKey?.trim();
    const value = rawValueParts.join("=").trim();
    if (!key || !value) return acc;
    if (key === "title") acc.title = value;
    if (key === "category") acc.category = value;
    if (key === "description") acc.description = value;
    if (key === "createdAt") acc.createdAt = value;
    if (key === "imageUrl") acc.imageUrl = value;
    return acc;
  }, {});
}

function getNoticeContextValues(asset: NoticeAsset): NoticeContextValues {
  const context = asset.context ?? {};
  const custom = context.custom;
  if (typeof custom === "string") {
    return parseCloudinaryContextString(custom);
  }
  if (custom && typeof custom === "object") {
    return custom;
  }
  return {
    title: context.title,
    category: context.category,
    description: context.description,
    createdAt: context.createdAt,
    imageUrl: context.imageUrl,
  };
}

export type NoticeItem = {
  id: string;
  title: string;
  category: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  resourceType: string;
  format?: string;
};

export type FolderCategory = {
  label: string;
  /** Canonical Cloudinary folder path for uploads (sanitized + lowercase). Empty string = fetch all. */
  folder: string;
  /** Optional legacy prefixes to include when listing existing images. */
  legacyPrefixes?: string[];
};

/**
 * IMPORTANT: These folder names must exactly match what you have in Cloudinary.
 * Log into cloudinary.com → Media Library to verify the actual folder names.
 *
 * If your folders are nested under "School/" (e.g. "School/Events"),
 * use those full paths here. If they're top-level, use the short names.
 */
export const CATEGORIES: FolderCategory[] = [
  { label: "All",      folder: "" },
  // Top-level folders (NOT nested under /school)
  { label: "School",   folder: "school", legacyPrefixes: ["School"] },
  { label: "Events",   folder: "events", legacyPrefixes: ["School/Events"] },
  { label: "Sports",   folder: "sports", legacyPrefixes: ["School/Sports"] },
  { label: "Students", folder: "students", legacyPrefixes: ["School/Students"] },
  { label: "Tour",     folder: "tour", legacyPrefixes: ["School/Tour"] },
];

export const UPLOAD_FOLDERS = CATEGORIES.filter((c) => c.folder !== "");

// ─── Helpers ────────────────────────────────────────────────────────────────

function sanitizeFolderSegment(segment: string): string {
  return segment
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
}

export function sanitizeFolderPath(folder: string): string {
  const normalized = folder.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const parts = normalized.split("/").map(sanitizeFolderSegment).filter(Boolean);
  return parts.join("/");
}

function toPrefixes(folderOrPrefixes: string | string[]): string[] {
  const raw = Array.isArray(folderOrPrefixes) ? folderOrPrefixes : [folderOrPrefixes];
  const prefixes = raw.map(sanitizeFolderPath).filter(Boolean);
  // stable unique
  return Array.from(new Set(prefixes));
}

function encodePublicId(publicId: string): string {
  return encodeURIComponent(publicId).replace(/%2F/g, "/");
}

function titleFromPublicId(publicId: string): string {
  const filename = publicId.split("/").pop() || "Notice";
  const normalized = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]\d{13,}$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized || /^\d+$/.test(normalized)) {
    return "Notice";
  }

  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

function slugFromTitle(title: string): string {
  const slug = sanitizeFolderPath(title);
  return slug || `notice-${Date.now()}`;
}

// ─── API calls ──────────────────────────────────────────────────────────────

export type PaginatedImagesResult = {
  images: GalleryImage[];
  nextCursor: string | null;
};

export type PaginatedNoticesResult = {
  notices: NoticeItem[];
  nextCursor: string | null;
};

/**
 * Fetch images from Cloudinary via our serverless proxy.
 * Passes the folder as a prefix so only matching images are returned.
 */
export async function fetchImages(
  folder: string | string[] = "",
  nextCursor?: string
): Promise<PaginatedImagesResult> {
  const prefixes = toPrefixes(folder);

  const search = new URLSearchParams();
  for (const p of prefixes) {
    search.append("prefix", p);
  }
  if (nextCursor) {
    search.set("next_cursor", nextCursor);
  }

  const query = search.toString();
  const url = query ? `/api/images?${query}` : "/api/images";

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load images.");
  }

  const resources = ((data.resources ?? []) as GalleryImage[]).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const cursor =
    typeof data.next_cursor === "string" && data.next_cursor.trim().length > 0
      ? (data.next_cursor as string)
      : null;

  return {
    images: resources,
    nextCursor: cursor,
  };
}

/**
 * Upload an image via a signed request (never exposes the API secret).
 * Uses the ROOT folder only for the signature (matches api/sign.ts behaviour).
 */
export async function uploadImage(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void
): Promise<GalleryImage> {
  const sanitizedFolder = sanitizeFolderPath(folder);

  const signRes = await fetch("/api/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: sanitizedFolder }),
  });

  if (!signRes.ok) {
    const err = await signRes.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? "Failed to get upload signature.");
  }

  const { signature, timestamp, apiKey, cloudName, folder: signedFolder } =
    (await signRes.json()) as {
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder?: string;
    };

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    if (signedFolder) formData.append("folder", signedFolder);

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName || CLOUD_NAME}/image/upload`
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText) as GalleryImage);
      } else {
        const body = JSON.parse(xhr.responseText || "{}") as { error?: { message?: string } };
        reject(new Error(body?.error?.message ?? "Upload failed."));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed — network error."));
    xhr.send(formData);
  });
}

export async function uploadNoticeFile(
  file: File,
  metadata: {
    title: string;
    category: string;
    description?: string;
    createdAt?: string;
    publicId?: string;
  },
  onProgress?: (pct: number) => void
): Promise<NoticeItem> {
  const folder = "notices";
  const publicId = metadata.publicId?.trim() || `${slugFromTitle(metadata.title)}-${Date.now()}`;
  const contextPayload = {
    title: metadata.title.trim(),
    category: metadata.category.trim(),
    description: (metadata.description ?? "").trim(),
    createdAt: metadata.createdAt ?? new Date().toISOString(),
  };

  const signRes = await fetch("/api/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, public_id: publicId, context: contextPayload }),
  });

  if (!signRes.ok) {
    const err = (await signRes.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? "Failed to get upload signature.");
  }

  const { signature, timestamp, apiKey, cloudName, folder: signedFolder, public_id, context } =
    (await signRes.json()) as {
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder?: string;
      public_id?: string;
      context?: string;
    };

  if (!signature || !timestamp || !apiKey || !cloudName) {
    throw new Error("Cloudinary upload signature was incomplete.");
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    if (signedFolder) formData.append("folder", signedFolder);
    if (public_id) formData.append("public_id", public_id);
    if (context) formData.append("context", context);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName || CLOUD_NAME}/image/upload`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      const body = JSON.parse(xhr.responseText || "{}") as NoticeAsset & {
        error?: { message?: string };
      };
      if (xhr.status === 200) {
        const contextValues = getNoticeContextValues(body);
        resolve({
          id: body.public_id,
          title: contextValues.title || contextPayload.title,
          category: contextValues.category || contextPayload.category,
          description: contextValues.description || contextPayload.description || undefined,
          imageUrl: body.secure_url,
          createdAt: contextValues.createdAt || body.created_at,
          resourceType: body.resource_type || "image",
          format: body.format,
        });
      } else {
        reject(new Error(body?.error?.message ?? "Notice upload failed."));
      }
    };

    xhr.onerror = () => reject(new Error("Notice upload failed — network error."));
    xhr.send(formData);
  });
}

export async function uploadNoticeImageUrl(metadata: {
  title: string;
  category: string;
  description?: string;
  createdAt?: string;
  imageUrl: string;
  publicId?: string;
}): Promise<NoticeItem> {
  const folder = "notices";
  const publicId = metadata.publicId?.trim() || `${slugFromTitle(metadata.title)}-${Date.now()}`;
  const sourceImageUrl = metadata.imageUrl.trim();
  if (!sourceImageUrl) {
    throw new Error("Image URL is required to upload notice image.");
  }

  const contextPayload = {
    title: metadata.title.trim(),
    category: metadata.category.trim(),
    description: (metadata.description ?? "").trim(),
    createdAt: metadata.createdAt ?? new Date().toISOString(),
  };

  const signRes = await fetch("/api/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, public_id: publicId, context: contextPayload }),
  });

  if (!signRes.ok) {
    const err = (await signRes.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? "Failed to get upload signature.");
  }

  const { signature, timestamp, apiKey, cloudName, folder: signedFolder, public_id, context } =
    (await signRes.json()) as {
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder?: string;
      public_id?: string;
      context?: string;
    };

  if (!signature || !timestamp || !apiKey || !cloudName) {
    throw new Error("Cloudinary upload signature was incomplete.");
  }

  const formData = new FormData();
  formData.append("file", sourceImageUrl);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  if (signedFolder) formData.append("folder", signedFolder);
  if (public_id) formData.append("public_id", public_id);
  if (context) formData.append("context", context);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName || CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const body = (await res.json().catch(() => ({}))) as NoticeAsset & {
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(body?.error?.message ?? "Notice upload failed.");
  }

  const contextValues = getNoticeContextValues(body);
  return {
    id: body.public_id,
    title: contextValues.title || contextPayload.title,
    category: contextValues.category || contextPayload.category,
    description: contextValues.description || contextPayload.description || undefined,
    imageUrl: body.secure_url,
    createdAt: contextValues.createdAt || body.created_at,
    resourceType: body.resource_type || "image",
    format: body.format,
  };
}

export async function uploadNoticeRecord(metadata: {
  title: string;
  category: string;
  description?: string;
  createdAt?: string;
  imageUrl?: string;
  publicId?: string;
}): Promise<NoticeItem> {
  const folder = "notices";
  const publicId = metadata.publicId?.trim() || `${slugFromTitle(metadata.title)}-${Date.now()}`;
  const contextPayload = {
    title: metadata.title.trim(),
    category: metadata.category.trim(),
    description: (metadata.description ?? "").trim(),
    createdAt: metadata.createdAt ?? new Date().toISOString(),
    imageUrl: (metadata.imageUrl ?? "").trim(),
  };

  const signRes = await fetch("/api/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, public_id: publicId, context: contextPayload }),
  });

  if (!signRes.ok) {
    const err = (await signRes.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(err?.error?.message ?? "Failed to get notice signature.");
  }

  const { signature, timestamp, apiKey, cloudName, folder: signedFolder, public_id, context } =
    (await signRes.json()) as {
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
      folder?: string;
      public_id?: string;
      context?: string;
    };

  if (!signature || !timestamp || !apiKey || !cloudName) {
    throw new Error("Cloudinary notice signature was incomplete.");
  }

  const json = JSON.stringify(contextPayload, null, 2);
  const file = new File([json], `${publicId}.json`, { type: "application/json" });
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  if (signedFolder) formData.append("folder", signedFolder);
  if (public_id) formData.append("public_id", public_id);
  if (context) formData.append("context", context);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName || CLOUD_NAME}/raw/upload`, {
    method: "POST",
    body: formData,
  });
  const body = (await res.json().catch(() => ({}))) as NoticeAsset & {
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(body?.error?.message ?? "Notice save failed.");
  }

  const contextValues = getNoticeContextValues(body);
  return {
    id: body.public_id,
    title: contextValues.title || contextPayload.title,
    category: contextValues.category || contextPayload.category,
    description: contextValues.description || contextPayload.description || undefined,
    imageUrl: contextValues.imageUrl || contextPayload.imageUrl || undefined,
    createdAt: contextValues.createdAt || body.created_at,
    resourceType: body.resource_type || "raw",
    format: body.format,
  };
}

export async function fetchNotices(nextCursor?: string): Promise<PaginatedNoticesResult> {
  const search = new URLSearchParams();
  if (nextCursor) search.set("next_cursor", nextCursor);
  const query = search.toString();
  const url = query ? `/api/notices?${query}` : "/api/notices";

  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load notices.");
  }

  const resources = (Array.isArray(data.resources) ? data.resources : []) as NoticeAsset[];
  const mappedNotices = resources.map((asset) => {
    const contextValues = getNoticeContextValues(asset);
    const title = contextValues.title?.trim() || titleFromPublicId(asset.public_id);
    const category = contextValues.category?.trim() || "General";
    return {
      id: asset.public_id,
      title,
      category,
      description: contextValues.description?.trim() || undefined,
      imageUrl:
        contextValues.imageUrl?.trim() ||
        (asset.resource_type === "image" ? asset.secure_url : undefined),
      createdAt: contextValues.createdAt?.trim() || asset.created_at,
      resourceType: asset.resource_type || "image",
      format: asset.format,
    } as NoticeItem;
  });

  // Cloudinary can contain both raw/image variants for the same public_id.
  // Keep only one notice per id so edits never appear as duplicates.
  const dedupedById = new Map<string, NoticeItem>();
  for (const notice of mappedNotices) {
    const existing = dedupedById.get(notice.id);
    if (!existing) {
      dedupedById.set(notice.id, notice);
      continue;
    }

    const noticeTime = new Date(notice.createdAt).getTime();
    const existingTime = new Date(existing.createdAt).getTime();
    if (noticeTime > existingTime) {
      dedupedById.set(notice.id, notice);
      continue;
    }

    // Tie-breaker: prefer image variant if timestamps are equal.
    if (
      noticeTime === existingTime &&
      notice.resourceType === "image" &&
      existing.resourceType !== "image"
    ) {
      dedupedById.set(notice.id, notice);
    }
  }

  const notices = Array.from(dedupedById.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const cursor =
    typeof data.next_cursor === "string" && data.next_cursor.trim().length > 0
      ? (data.next_cursor as string)
      : null;

  return { notices, nextCursor: cursor };
}

/**
 * Delete an asset from Cloudinary via our serverless endpoint.
 *
 * @param publicId    - The Cloudinary public_id of the asset (no file extension).
 * @param resourceType - The resource type: "image" | "raw" | "video".
 *                       Pass notice.resourceType for notices, "image" for gallery images.
 *                       Defaults to "image" if omitted.
 *
 * FIX: Previously this tried to infer resource_type from the publicId extension,
 * but Cloudinary public_ids never include extensions, so it always fell back to
 * "image" — causing a 400 for raw assets (e.g. notice JSON files).
 */
export async function deleteImage(
  publicId: string,
  resourceType: string = "image"
): Promise<void> {
  const normalizedPublicId =
    resourceType.trim().toLowerCase() === "raw"
      ? publicId.replace(/\.[^.\/]+$/i, "")
      : publicId;
  const res = await fetch("/api/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id: normalizedPublicId, resource_type: resourceType }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: { message?: string } };
    const message = (data?.error?.message ?? "Delete failed.").trim();
    const lowered = message.toLowerCase();
    if (
      lowered.includes("not found") ||
      lowered.includes("not_found") ||
      lowered.includes("can't find resource") ||
      lowered.includes("does not exist")
    ) {
      return;
    }
    throw new Error(message);
  }
}

// ─── URL builders ───────────────────────────────────────────────────────────

export function getImageUrl(publicId: string, width = 800): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},c_fill,q_auto,f_auto/${encodePublicId(publicId)}`;
}

export function getThumbnailUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_300,c_fill,q_auto,f_auto/${encodePublicId(publicId)}`;
}