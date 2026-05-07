import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardMedia,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CATEGORIES, deleteImage, fetchImages, getThumbnailUrl, type GalleryImage } from "../../../services/Cloudinary";

type ImageManagerProps = {
  refreshKey: number;
};

const UPLOAD_FOLDERS = CATEGORIES.filter((category) => category.folder !== "");
const DEFAULT_FOLDER = UPLOAD_FOLDERS[0]?.folder ?? "";

export function ImageManager({ refreshKey }: ImageManagerProps) {
  const [folder, setFolder] = useState(DEFAULT_FOLDER);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [loadMsg, setLoadMsg] = useState("");

  const loadTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (loadTimerRef.current !== null) {
      window.clearTimeout(loadTimerRef.current);
    }

    let active = true;
    loadTimerRef.current = window.setTimeout(async () => {
      if (!active) return;
      setLoading(true);
      setLoadMsg("");
      try {
        const category = UPLOAD_FOLDERS.find((c) => c.folder === folder);
        const prefixes = category
          ? [category.folder, ...(category.legacyPrefixes ?? [])]
          : [folder];
        const { images: fetchedImages } = await fetchImages(prefixes);
        if (active) setImages(fetchedImages);
      } catch (e) {
        if (!active) return;
        setImages([]);
        setLoadMsg(e instanceof Error ? e.message : "Could not load images.");
      } finally {
        if (active) setLoading(false);
      }
    }, 0);

    return () => {
      active = false;
      if (loadTimerRef.current !== null) {
        window.clearTimeout(loadTimerRef.current);
      }
    };
  }, [folder, refreshKey]);

  const handleDelete = async (publicId: string) => {
    if (!window.confirm("Delete this image? This cannot be undone.")) return;

    setDeleting(publicId);
    try {
      await deleteImage(publicId);
      setImages((prev) => prev.filter((image) => image.public_id !== publicId));
      setDeleteMsg("Image deleted.");
      setTimeout(() => setDeleteMsg(""), 3000);
    } catch {
      setDeleteMsg("Delete failed — please remove from Cloudinary dashboard.");
      setTimeout(() => setDeleteMsg(""), 5000);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Box sx={{ bgcolor: "white", borderRadius: 3, p: { xs: 2.5, md: 3.5 }, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
      <Typography sx={{ fontWeight: 700, color: "#074783", fontSize: "1.1rem", mb: 2.5 }}>
        Manage Photos
      </Typography>

      <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
        <InputLabel>View Folder</InputLabel>
        <Select label="View Folder" value={folder} onChange={(event) => setFolder(event.target.value)}>
          {UPLOAD_FOLDERS.map((category) => (
            <MenuItem key={category.folder} value={category.folder}>{category.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {deleteMsg && <Alert severity={deleteMsg.includes("failed") ? "error" : "success"} sx={{ mb: 2 }}>{deleteMsg}</Alert>}
      {loadMsg && <Alert severity="error" sx={{ mb: 2 }}>{loadMsg}</Alert>}

      {loading ? (
        <LinearProgress sx={{ borderRadius: 1 }} />
      ) : images.length === 0 ? (
        <Typography sx={{ color: "#9ca3af", textAlign: "center", py: 4 }}>
          No images in this folder yet.
        </Typography>
      ) : (
        <>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem", mb: 2 }}>
            {images.length} photo(s)
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 2,
            }}
          >
            {images.map((image) => (
              <Card key={image.public_id} sx={{ borderRadius: 2, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <CardMedia
                  component="img"
                  image={getThumbnailUrl(image.public_id)}
                  alt={image.display_name || image.public_id}
                  sx={{ height: 130, objectFit: "cover" }}
                />
                <CardActions sx={{ p: 0.75, justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontSize: "0.7rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                    {image.display_name || image.public_id.split("/").pop()}
                  </Typography>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(image.public_id)}
                      disabled={deleting === image.public_id}
                      sx={{ color: "#ef4444", "&:hover": { bgcolor: "#fee2e2" } }}
                    >
                      {deleting === image.public_id ? <CircularProgress size={14} /> : <DeleteIcon sx={{ fontSize: 16 }} />}
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
