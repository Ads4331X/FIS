import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Chip,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  alpha,
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
const DEFAULT_UPLOAD_FOLDER = UPLOAD_FOLDERS[0]?.folder ?? "";

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
    <Box
      sx={(t) => ({
        bgcolor: "background.paper",
        borderRadius: 3,
        p: { xs: 2.5, md: 3.5 },
        boxShadow:
          t.palette.mode === "dark"
            ? "0 18px 50px rgba(0,0,0,0.45)"
            : "0 18px 50px rgba(15,23,42,0.08)",
        border: `1px solid ${alpha(t.palette.divider, 0.85)}`,
      })}
    >
      <Typography
        sx={(t) => ({
          fontWeight: 950,
          letterSpacing: "-0.01em",
          color: t.palette.text.primary,
          fontSize: "1.1rem",
          mb: 2.25,
        })}
      >
        Upload Images
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
        sx={(t) => ({
          border: `1.5px dashed ${alpha(t.palette.divider, 0.9)}`,
          borderRadius: 3,
          p: { xs: 3, md: 5 },
          textAlign: "center",
          cursor: "pointer",
          bgcolor: alpha(t.palette.background.paper, t.palette.mode === "dark" ? 0.45 : 0.65),
          transition: "transform 220ms ease, border-color 220ms ease, background-color 220ms ease",
          "&:hover": {
            borderColor: alpha(t.palette.primary.main, 0.45),
            bgcolor: alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.12 : 0.08),
            transform: "translateY(-1px)",
          },
        })}
      >
        <Box
          sx={(t) => ({
            mx: "auto",
            width: 64,
            height: 64,
            borderRadius: 3,
            display: "grid",
            placeItems: "center",
            bgcolor: alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.16 : 0.10),
            border: `1px solid ${alpha(t.palette.primary.main, 0.22)}`,
            mb: 1.25,
          })}
        >
          <CloudUploadIcon sx={{ fontSize: 34, color: "primary.main" }} />
        </Box>
        <Typography sx={{ color: "text.primary", fontWeight: 900, letterSpacing: "-0.01em" }}>
          Upload Images
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", mt: 0.5, lineHeight: 1.7 }}>
          Drag and drop photos here, or click to browse files
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 1.25, flexWrap: "wrap", justifyContent: "center" }}
        >
          {["JPG", "PNG", "WEBP"].map((fmt) => (
            <Chip
              key={fmt}
              label={fmt}
              size="small"
              variant="outlined"
              sx={(t) => ({
                borderColor: alpha(t.palette.divider, 0.9),
                bgcolor: alpha(t.palette.background.paper, t.palette.mode === "dark" ? 0.45 : 0.65),
                fontWeight: 800,
              })}
            />
          ))}
          <Chip
            label="MAX 10MB"
            size="small"
            variant="outlined"
            sx={(t) => ({
              borderColor: alpha(t.palette.divider, 0.9),
              bgcolor: alpha(t.palette.background.paper, t.palette.mode === "dark" ? 0.45 : 0.65),
              fontWeight: 900,
            })}
          />
        </Stack>
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
              <Box
                key={`${file.file.name}-${index}`}
                sx={(t) => ({
                  position: "relative",
                  borderRadius: 2.5,
                  overflow: "hidden",
                  aspectRatio: "1",
                  border: `1px solid ${alpha(t.palette.divider, 0.85)}`,
                  boxShadow:
                    t.palette.mode === "dark"
                      ? "0 14px 40px rgba(0,0,0,0.35)"
                      : "0 14px 40px rgba(15,23,42,0.10)",
                  transition: "transform 220ms ease, box-shadow 220ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow:
                      t.palette.mode === "dark"
                        ? "0 16px 46px rgba(0,0,0,0.45)"
                        : "0 18px 50px rgba(15,23,42,0.14)",
                  },
                })}
              >
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
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      bgcolor: "rgba(0,0,0,0.55)",
                      color: "white",
                      p: 0.3,
                      transition: "transform 200ms ease, background-color 200ms ease",
                      "&:hover": { bgcolor: "rgba(200,0,0,0.85)", transform: "scale(1.05)" },
                    }}
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
              sx={(t) => ({
                flex: 1,
                borderRadius: 2,
                fontWeight: 900,
                boxShadow: `0 14px 40px ${alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.22 : 0.18)}`,
                transition: "transform 200ms ease, box-shadow 200ms ease",
                "&:hover": { transform: "translateY(-1px)" },
              })}
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
