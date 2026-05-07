import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  alpha,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

type DeleteConfirmDialogProps = {
  open: boolean;
  title?: string;
  noticeTitle: string | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmDialog({
  open,
  title = "Delete Notice?",
  noticeTitle,
  loading = false,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          fontWeight: 900,
          letterSpacing: "-0.01em",
        }}
      >
        <Box
          sx={(t) => ({
            width: 36,
            height: 36,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            color: t.palette.error.main,
            bgcolor: alpha(t.palette.error.main, 0.12),
            border: `1px solid ${alpha(t.palette.error.main, 0.25)}`,
          })}
        >
          <WarningAmberIcon fontSize="small" />
        </Box>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "text.secondary" }}>
          {noticeTitle ? (
            <>
              Are you sure you want to delete <strong>{noticeTitle}</strong>?
              This action cannot be undone.
            </>
          ) : (
            "This action cannot be undone."
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onCancel} sx={{ fontWeight: 800 }} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={16} color="inherit" /> : undefined
          }
          sx={{ borderRadius: 2, fontWeight: 800 }}
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
