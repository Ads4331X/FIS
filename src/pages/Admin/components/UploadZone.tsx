import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CATEGORIES, uploadImage } from "../../../services/Cloudinary";

type UploadFile = {
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
};

type UploadZoneProps = {
  onUploaded: () => void;
};

const UPLOAD_FOLDERS = CATEGORIES.filter((category) => category.folder !== "");
const DEFAULT_UPLOAD_FOLDER =
  UPLOAD_FOLDERS.find((category) => category.folder === "School")?.folder ??
  UPLOAD_FOLDERS[0]?.folder ??
  "";

export function UploadZone({ onUploaded }: UploadZoneProps) {
  const [folder, setFolder] = useState(DEFAULT_UPLOAD_FOLDER);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<UploadFile[]>([]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  const addFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "pending" as const,
      }));

    setFiles((prev) => [...prev, ...newFiles]);
    setAllDone(false);
  };

  const removeFile = (index: number) => {
    const current = files[index];
    if (current) URL.revokeObjectURL(current.preview);
    setFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const clearAll = () => {
    files.forEach((item) => URL.revokeObjectURL(item.preview));
    setFiles([]);
    setAllDone(false);
  };

  const uploadAll = async () => {
    if (!files.length) return;

    setUploading(true);
    setAllDone(false);

    for (let index = 0; index < files.length; index += 1) {
      if (files[index].status === "done") continue;

      setFiles((prev) =>
        prev.map((item, itemIndex) =>
          itemIndex === index ? { ...item, status: "uploading" } : item,
        ),
      );

      try {
        await uploadImage(files[index].file, folder, (pct) => {
          setFiles((prev) =>
            prev.map((item, itemIndex) =>
              itemIndex === index ? { ...item, progress: pct } : item,
            ),
          );
        });
        setFiles((prev) =>
          prev.map((item, itemIndex) =>
            itemIndex === index ? { ...item, status: "done", progress: 100 } : item,
          ),
        );
      } catch {
        setFiles((prev) =>
          prev.map((item, itemIndex) =>
            itemIndex === index ? { ...item, status: "error" } : item,
          ),
        );
      }
    }

    setUploading(false);
    setAllDone(true);
    onUploaded();
  };

  return (
    <Box sx={{ bgcolor: "white", borderRadius: 3, p: { xs: 2.5, md: 3.5 }, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", mb: 4 }}>
      <Typography sx={{ fontWeight: 700, color: "#074783", fontSize: "1.1rem", mb: 2.5 }}>
        Upload Photos
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
        <InputLabel>Upload to Folder</InputLabel>
        <Select
          label="Upload to Folder"
          value={folder}
          onChange={(event) => setFolder(event.target.value)}
        >
          {UPLOAD_FOLDERS.map((category) => (
            <MenuItem key={category.folder} value={category.folder}>{category.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
        onDragOver={(event) => event.preventDefault()}
        onClick={() => inputRef.current?.click()}
        sx={{
          border: "2px dashed #cbd5e1",
          borderRadius: 2,
          p: { xs: 3, md: 5 },
          textAlign: "center",
          cursor: "pointer",
          bgcolor: "#f8fafc",
          transition: "all 0.2s",
          "&:hover": { borderColor: "#074783", bgcolor: "#eff6ff" },
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
        <Typography sx={{ color: "#64748b", fontWeight: 600 }}>Drag & drop images here</Typography>
        <Typography sx={{ color: "#9ca3af", fontSize: "0.85rem", mt: 0.5 }}>
          or click to browse — JPG, PNG, WEBP
        </Typography>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => event.target.files && addFiles(event.target.files)}
        />
      </Box>

      {files.length > 0 && (
        <Box sx={{ mt: 2.5 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 1.5,
              mb: 2,
            }}
          >
            {files.map((file, index) => (
              <Box key={`${file.file.name}-${index}`} sx={{ position: "relative", borderRadius: 2, overflow: "hidden", aspectRatio: "1" }}>
                <Box component="img" src={file.preview} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {file.status === "uploading" && (
                  <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress size={24} sx={{ color: "white" }} />
                    <Typography sx={{ color: "white", fontSize: "0.7rem", mt: 0.5 }}>{file.progress}%</Typography>
                  </Box>
                )}
                {file.status === "done" && (
                  <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,100,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircleIcon sx={{ color: "white", fontSize: 28 }} />
                  </Box>
                )}
                {file.status === "error" && (
                  <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, bgcolor: "rgba(200,0,0,0.7)", py: 0.5 }}>
                    <Typography sx={{ color: "white", fontSize: "0.65rem", textAlign: "center" }}>Failed</Typography>
                  </Box>
                )}
                {file.status === "pending" && (
                  <IconButton
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFile(index);
                    }}
                    sx={{ position: "absolute", top: 2, right: 2, bgcolor: "rgba(0,0,0,0.6)", color: "white", p: 0.3, "&:hover": { bgcolor: "rgba(200,0,0,0.8)" } }}
                  >
                    <DeleteIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </Box>
            ))}
          </Box>

          {allDone && <Alert severity="success" sx={{ mb: 2 }}>All photos uploaded successfully!</Alert>}

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="contained"
              onClick={uploadAll}
              disabled={uploading || files.every((file) => file.status === "done")}
              startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
              sx={{ bgcolor: "#074783", flex: 1, borderRadius: 2, fontWeight: 700, "&:hover": { bgcolor: "#0a5a9e" } }}
            >
              {uploading ? "Uploading..." : `Upload ${files.filter((file) => file.status !== "done").length} Photo(s)`}
            </Button>
            <Button variant="outlined" onClick={clearAll} disabled={uploading} sx={{ borderRadius: 2 }}>
              Clear
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
