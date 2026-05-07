const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;

export type GalleryImage = {
  public_id: string;
  secure_url: string;
  folder: string;
  display_name?: string;
  created_at: string;
  width: number;
  height: number;
};

export type FolderCategory = {
  label: string;
  /** The Cloudinary folder path used as a prefix. Empty string = fetch all. */
  folder: string;
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
  { label: "School",   folder: "School" },
  { label: "Events",   folder: "School/Events" },
  { label: "Sports",   folder: "School/Sports" },
  { label: "Students", folder: "School/Students" },
  { label: "Tour",     folder: "School/Tour" },
];

export const UPLOAD_FOLDERS = CATEGORIES.filter((c) => c.folder !== "");

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalizeFolder(folder: string): string {
  return folder.trim().replace(/^\/+|\/+$/g, "");
}

/** Strip any nested path and return only the root folder name for uploads. */
function rootFolderOnly(folder: string): string {
  return normalizeFolder(folder).split("/").filter(Boolean)[0] ?? "";
}

function encodePublicId(publicId: string): string {
  return encodeURIComponent(publicId).replace(/%2F/g, "/");
}

// ─── API calls ──────────────────────────────────────────────────────────────

/**
 * Fetch images from Cloudinary via our serverless proxy.
 * Passes the folder as a prefix so only matching images are returned.
 */
export async function fetchImages(folder: string = ""): Promise<GalleryImage[]> {
  const prefix = normalizeFolder(folder);
  const url = prefix ? `/api/images?prefix=${encodeURIComponent(prefix)}` : "/api/images";

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Failed to load images.");
  }

  return ((data.resources ?? []) as GalleryImage[]).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
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
  const rootFolder = rootFolderOnly(folder);

  const signRes = await fetch("/api/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: rootFolder }),
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