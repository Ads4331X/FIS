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
  folder: string;
  readFolders?: string[];
};

export const CATEGORIES: FolderCategory[] = [
  { label: "All", folder: "" },
  { label: "School", folder: "School" },
  { label: "Events", folder: "Events" },
  { label: "Sports", folder: "Sports" },
  { label: "Students", folder: "Students" },
  { label: "Tour", folder: "Tour" },
];

export const UPLOAD_FOLDERS = CATEGORIES.filter((c) => c.folder !== "");

function normalizeUploadFolder(folder: string): string {
  return folder.trim().replace(/^\/+|\/+$/g, "");
}

function normalizeRootFolder(folder: string): string {
  return normalizeUploadFolder(folder).split("/").filter(Boolean).pop() ?? "";
}

export async function fetchImages(folder: string = ""): Promise<GalleryImage[]> {
  const normalizedFolder = normalizeUploadFolder(folder);
  const requestedFolder = normalizedFolder === "" ? "/" : normalizedFolder;
  const res = await fetch("/api/images");
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "Failed to load images.");
  }

  return (data.resources || [])
    .map((r: GalleryImage) => ({ ...r, folder: requestedFolder }))
    .sort(
      (a: GalleryImage, b: GalleryImage) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
}
export async function uploadImage(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void
): Promise<GalleryImage> {
  const rootFolder = normalizeRootFolder(folder);
  const signResponse = await fetch("/api/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folder: rootFolder }),
  });

  if (!signResponse.ok) {
    throw new Error("Failed to get upload signature from server.");
  }

  const { signature, timestamp, apiKey, cloudName, folder: signedFolder } = (await signResponse.json()) as {
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
    if (signedFolder) {
      formData.append("folder", signedFolder);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName || CLOUD_NAME}/image/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(formData);
  });
}

export async function deleteImage(publicId: string, cloudName: string = CLOUD_NAME): Promise<void> {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
  const formData = new FormData();
  formData.append("public_id", publicId);
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Delete failed");
}

function encodePublicId(publicId: string): string {
  return encodeURIComponent(publicId).replace(/%2F/g, "/");
}

export function getImageUrl(publicId: string, width = 800): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},c_fill,q_auto,f_auto/${encodePublicId(publicId)}`;
}

export function getThumbnailUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_300,c_fill,q_auto,f_auto/${encodePublicId(publicId)}`;
}