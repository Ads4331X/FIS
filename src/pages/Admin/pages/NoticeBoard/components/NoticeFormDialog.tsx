import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LinkIcon from "@mui/icons-material/Link";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { uploadNoticeFile, uploadNoticeRecord } from "../../../../../services/Cloudinary";
import {
  NOTICE_CATEGORIES,
  NOTICE_STATUSES,
  type Notice,
  type NoticeCategory,
  type NoticeStatus,
} from "../data";

type NoticeFormDialogProps = {
  open: boolean;
  notice: Notice | null;
  onClose: () => void;
  onSave: (
    notice: Omit<Notice, "id" | "postedAt"> & { id?: string; postedAt?: string },
  ) => void;
};

type ImageMode = "none" | "url" | "upload";

function statusLabel(status: NoticeStatus): string {
  return status === "published" ? "Published" : "Draft";
}

export function NoticeFormDialog({
  open,
  notice,
  onClose,
  onSave,
}: NoticeFormDialogProps) {
  const isFullScreen = useMediaQuery("(max-width:600px)");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isFullScreen}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: { xs: 0, sm: 3 } } } }}
    >
      {open && (
        <NoticeFormContents
          key={notice?.id ?? "new"}
          notice={notice}
          onClose={onClose}
          onSave={onSave}
        />
      )}
    </Dialog>
  );
}

type NoticeFormContentsProps = {
  notice: Notice | null;
  onClose: () => void;
  onSave: NoticeFormDialogProps["onSave"];
};

function NoticeFormContents({ notice, onClose, onSave }: NoticeFormContentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isPublishedLocked = notice?.status === "published";

  const [title, setTitle] = useState(() => notice?.title ?? "");
  const [description, setDescription] = useState(() => notice?.description ?? "");
  const [category, setCategory] = useState<NoticeCategory>(
    () => notice?.category ?? "Event",
  );
  const [status, setStatus] = useState<NoticeStatus>(
    () => notice?.status ?? "draft",
  );
  const [imageUrl, setImageUrl] = useState(() => notice?.imageUrl ?? "");
  const [imageMode, setImageMode] = useState<ImageMode>(() =>
    notice?.imageUrl ? "url" : "none",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    return () => {
      if (imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleFileSelected = (file: File | undefined) => {
    if (!file) return;
    setUploadError("");

    if (imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }

    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError("");

    if (!title.trim()) {
      setSubmitError("Please enter a notice title.");
      return;
    }
    if (!description.trim()) {
      setSubmitError("Please enter a description.");
      return;
    }

    const finalStatus: NoticeStatus = isPublishedLocked ? "published" : status;
    const shouldSyncToCloudinary = finalStatus === "published";

    // FIX: track cloudinaryId and resourceType from the upload result
    let cloudinaryId: string | undefined = notice?.cloudinaryId;
    let resourceType: string | undefined = notice?.resourceType;
    let finalImageUrl = imageMode === "none" ? undefined : imageUrl.trim() || undefined;

    if (shouldSyncToCloudinary) {
      setUploading(true);
      try {
        const createdAt = notice?.postedAt ?? new Date().toISOString();

        if (imageMode === "upload" && selectedFile) {
          // Upload image file — resourceType will be "image"
          const result = await uploadNoticeFile(selectedFile, {
            title,
            category,
            description,
            createdAt,
            publicId: notice?.cloudinaryId ?? notice?.id,
          });
          cloudinaryId = result.id;
          resourceType = result.resourceType; // "image"
          finalImageUrl = result.imageUrl;
        } else {
          // Upload metadata record — resourceType will be "raw"
          const result = await uploadNoticeRecord({
            title,
            category,
            description,
            createdAt,
            imageUrl: finalImageUrl,
            publicId: notice?.cloudinaryId ?? notice?.id,
          });
          cloudinaryId = result.id;
          resourceType = result.resourceType; // "raw"
          finalImageUrl = result.imageUrl ?? finalImageUrl;
        }
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Notice save failed.",
        );
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Blob preview URLs are temporary — don't persist them for drafts
    if (!shouldSyncToCloudinary && imageMode === "upload") {
      finalImageUrl = undefined;
    }

    onSave({
      id: notice?.id,
      postedAt: notice?.postedAt,
      title: title.trim(),
      description: description.trim(),
      category,
      status: finalStatus,
      imageUrl: finalImageUrl,
      // FIX: pass cloudinaryId and resourceType so NoticeBoard can delete correctly
      cloudinaryId,
      resourceType,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          fontWeight: 900,
          letterSpacing: "-0.01em",
          pb: 1,
        }}
      >
        {notice ? "Edit Notice" : "Post New Notice"}
        <IconButton onClick={onClose} aria-label="Close" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {submitError && <Alert severity="error">{submitError}</Alert>}
        <TextField
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          fullWidth
          autoFocus
        />
        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          multiline
          minRows={3}
          maxRows={8}
          fullWidth
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={category}
              onChange={(event) => setCategory(event.target.value as NoticeCategory)}
            >
              {NOTICE_CATEGORIES.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value as NoticeStatus)}
            >
              {NOTICE_STATUSES.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  disabled={isPublishedLocked && option === "draft"}
                >
                  {statusLabel(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        {isPublishedLocked && (
          <Typography variant="caption" sx={{ color: "text.secondary", mt: -1 }}>
            Published notices cannot be moved back to draft.
          </Typography>
        )}

        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 13, mb: 1 }}>
            Cover Image (optional)
          </Typography>
          <ToggleButtonGroup
            value={imageMode}
            exclusive
            size="small"
            onChange={(_, value: ImageMode | null) => {
              if (!value) return;
              setImageMode(value);
              if (value !== "upload") {
                setSelectedFile(null);
              }
            }}
            sx={{ mb: 1.5 }}
          >
            <ToggleButton value="none" sx={{ textTransform: "none", px: 1.5 }}>
              None
            </ToggleButton>
            <ToggleButton value="url" sx={{ textTransform: "none", px: 1.5 }}>
              <LinkIcon fontSize="small" sx={{ mr: 0.5 }} />
              URL
            </ToggleButton>
            <ToggleButton value="upload" sx={{ textTransform: "none", px: 1.5 }}>
              <CloudUploadIcon fontSize="small" sx={{ mr: 0.5 }} />
              Upload
            </ToggleButton>
          </ToggleButtonGroup>

          {imageMode === "url" && (
            <TextField
              label="Image URL"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              fullWidth
              placeholder="https://..."
            />
          )}

          {imageMode === "upload" && (
            <Stack spacing={1.25}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) =>
                  handleFileSelected(event.target.files?.[0])
                }
              />
              <Button
                variant="outlined"
                startIcon={
                  uploading ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CloudUploadIcon fontSize="small" />
                  )
                }
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                sx={{ borderRadius: 2 }}
              >
                {uploading
                  ? "Uploading..."
                  : selectedFile
                    ? selectedFile.name
                    : "Choose Image"}
              </Button>
              {selectedFile && (
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  This file will be uploaded to Cloudinary when you post the notice.
                </Typography>
              )}
              {uploadError && <Alert severity="error">{uploadError}</Alert>}
            </Stack>
          )}

          {imageMode !== "none" && imageUrl && (
            <Box
              sx={(t) => ({
                mt: 1.5,
                borderRadius: 2,
                overflow: "hidden",
                border: `1px solid ${alpha(t.palette.divider, 0.85)}`,
                position: "relative",
                aspectRatio: "16 / 9",
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              })}
            >
              <IconButton
                size="small"
                onClick={() => {
                  if (imageUrl.startsWith("blob:")) {
                    URL.revokeObjectURL(imageUrl);
                  }
                  setImageUrl("");
                  setSelectedFile(null);
                  setImageMode("none");
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(0,0,0,0.55)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
                }}
                aria-label="Remove image"
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={uploading} sx={{ fontWeight: 800 }}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={uploading}
          sx={(t) => ({
            borderRadius: 2,
            fontWeight: 800,
            boxShadow: `0 14px 40px ${alpha(
              t.palette.primary.main,
              t.palette.mode === "dark" ? 0.22 : 0.18,
            )}`,
          })}
        >
          {uploading ? "Uploading..." : notice ? "Save Changes" : "Post Notice"}
        </Button>
      </DialogActions>
    </Box>
  );
}