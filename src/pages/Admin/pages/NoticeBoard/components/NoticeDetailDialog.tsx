import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { formatNoticeDate, type Notice } from "../data";
import { getCategoryColors, getStatusColor } from "../categoryStyles";

type NoticeDetailDialogProps = {
  open: boolean;
  notice: Notice | null;
  onClose: () => void;
  onEdit?: (notice: Notice) => void;
  onDelete?: (notice: Notice) => void;
};

export function NoticeDetailDialog({
  open,
  notice,
  onClose,
  onEdit,
  onDelete,
}: NoticeDetailDialogProps) {
  const isFullScreen = useMediaQuery("(max-width:600px)");

  return (
    <Dialog
      open={open && Boolean(notice)}
      onClose={onClose}
      fullScreen={isFullScreen}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: { xs: 0, sm: 3 } } } }}
    >
      {notice && (
        <>
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
            Notice Details
            <IconButton onClick={onClose} aria-label="Close" size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            {notice.imageUrl && (
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  bgcolor: "background.default",
                  backgroundImage: `url(${notice.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                role="img"
                aria-label={notice.title}
              />
            )}
            <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "wrap", alignItems: "center", mb: 1.5 }}
              >
                <Chip
                  size="small"
                  label={notice.category.toUpperCase()}
                  sx={(t) => {
                    const c = getCategoryColors(t, notice.category);
                    return {
                      fontWeight: 900,
                      letterSpacing: "0.05em",
                      bgcolor: c.bg,
                      color: c.fg,
                      border: `1px solid ${c.border}`,
                      height: 22,
                    };
                  }}
                />
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                  }}
                >
                  <Box
                    sx={(t) => ({
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: getStatusColor(t, notice.status),
                      boxShadow: `0 0 0 3px ${alpha(
                        getStatusColor(t, notice.status),
                        0.18,
                      )}`,
                    })}
                  />
                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                    {notice.status === "published" ? "Published" : "Draft"}
                  </Typography>
                </Box>
                <Typography sx={{ color: "text.secondary", fontSize: 12.5 }}>
                  Posted {formatNoticeDate(notice.postedAt)}
                </Typography>
              </Stack>

              <Typography
                sx={{
                  fontWeight: 950,
                  letterSpacing: "-0.01em",
                  fontSize: { xs: "1.4rem", md: "1.7rem" },
                  mb: 1.5,
                }}
              >
                {notice.title}
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.85,
                  whiteSpace: "pre-wrap",
                  fontSize: "1rem",
                }}
              >
                {notice.description}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: "wrap" }}>
            <Box sx={{ flex: 1 }} />
            {onDelete && (
              <Button
                onClick={() => onDelete(notice)}
                color="error"
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                sx={{ fontWeight: 800 }}
              >
                Delete
              </Button>
            )}
            {onEdit && (
              <Button
                onClick={() => onEdit(notice)}
                variant="contained"
                startIcon={<EditOutlinedIcon fontSize="small" />}
                sx={{ borderRadius: 2, fontWeight: 800 }}
              >
                Edit Notice
              </Button>
            )}
            <Button onClick={onClose} sx={{ fontWeight: 800 }}>
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
