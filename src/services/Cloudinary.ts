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
  { label: "School", folder: "School", readFolders: ["School", "Home/School"] },
  {
    label: "Events",
    folder: "School/Events",
    readFolders: ["School/Events", "Home/School/Events"],
  },
  {
    label: "Sports",
    folder: "School/Sports",
    readFolders: ["School/Sports", "Home/School/Sports"],
  },
  {
    label: "Students",
    folder: "School/Students",
    readFolders: [
      "School/Students",
      "School/Student",
      "Home/School/Students",
      "Home/School/Student",
    ],
  },
  { label: "Tour", folder: "School/Tour", readFolders: ["School/Tour", "Home/School/Tour"] },
];

export const UPLOAD_FOLDERS = CATEGORIES.filter((c) => c.folder !== "");

const GALLERY_FOLDERS = Array.from(
  new Set(UPLOAD_FOLDERS.flatMap((category) => category.readFolders ?? [category.folder]))
);

function getReadFolders(folder: string): string[] {
  const match = CATEGORIES.find((category) => category.folder === folder);
  return match ? match.readFolders ?? [match.folder] : [folder];
}

export async function fetchImages(folder: string = ""): Promise<GalleryImage[]> {
  const folders = folder ? getReadFolders(folder) : GALLERY_FOLDERS;
  const errors: string[] = [];

  const results = await Promise.all(
    folders.map(async (f) => {
      try {
        const res = await fetch(`/api/images?folder=${encodeURIComponent(f)}`);
        const data = await res.json();
        if (!res.ok) {
          errors.push(data?.error?.message || `Failed to load folder: ${f}`);
          return [];
        }
        return (data.resources || []).map((r: GalleryImage) => ({ ...r, folder: f }));
      } catch (error) {
        errors.push(error instanceof Error ? error.message : `Failed to load folder: ${f}`);
        return [];
      }
    })
  );

  const merged = results.flat().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  if (merged.length === 0 && errors.length > 0) {
    throw new Error(errors[0]);
  }
  return merged;
}
export async function uploadImage(
  file: File,
  folder: string,
  onProgress?: (pct: number) => void
): Promise<GalleryImage> {
  const cleanFolder = folder.trim().replace(/^\/+|\/+$/g, "");

  const signResponse = await fetch("/api/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ folder: cleanFolder }),
  });

  if (!signResponse.ok) {
    throw new Error("Failed to get upload signature from server.");
  }

  const { signature, timestamp, apiKey, cloudName } = (await signResponse.json()) as {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
  };

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    if (cleanFolder) {
      formData.append("folder", cleanFolder);
    }
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);

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