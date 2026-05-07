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

// ─── API calls ──────────────────────────────────────────────────────────────

export type PaginatedImagesResult = {
  images: GalleryImage[];
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

/**
 * Delete an image via our serverless endpoint (keeps the API secret server-side).
 */
export async function deleteImage(publicId: string): Promise<void> {
  const res = await fetch("/api/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public_id: publicId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(data?.error?.message ?? "Delete failed.");
  }
}

// ─── URL builders ───────────────────────────────────────────────────────────

export function getImageUrl(publicId: string, width = 800): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},c_fill,q_auto,f_auto/${encodePublicId(publicId)}`;
}

export function getThumbnailUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_300,c_fill,q_auto,f_auto/${encodePublicId(publicId)}`;
}