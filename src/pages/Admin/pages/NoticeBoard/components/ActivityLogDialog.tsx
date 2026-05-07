import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined";
import type { ReactElement } from "react";
import {
  formatNoticeDate,
  formatRelativeTime,
  type NoticeActivity,
  type NoticeActivityType,
} from "../data";

type ActivityLogDialogProps = {
  open: boolean;
  activity: NoticeActivity[];
  onClose: () => void;
  onClear?: () => void;
};

const ICONS: Record<NoticeActivityType, ReactElement> = {
  updated: <EditNoteOutlinedIcon fontSize="small" />,
  published: <CampaignOutlinedIcon fontSize="small" />,
  removed: <DeleteOutlineIcon fontSize="small" />,
  created: <AddCircleOutlineIcon fontSize="small" />,
};

const ACCENTS: Record<
  NoticeActivityType,
  "primary" | "success" | "error" | "info"
> = {
  updated: "primary",
  published: "success",
  removed: "error",
  created: "info",
};

const TYPE_LABEL: Record<NoticeActivityType, string> = {
  updated: "Updated",
  published: "Published",
  removed: "Removed",
  created: "Created",
};

export function ActivityLogDialog({
  open,
  activity,
  onClose,
  onClear,
}: ActivityLogDialogProps) {
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
        Activity Log
        <IconButton onClick={onClose} aria-label="Close" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {activity.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography sx={{ color: "text.secondary" }}>
              No activity yet.
            </Typography>
          </Box>
        ) : (
          <Stack divider={<Divider sx={{ opacity: 0.6 }} />}>
            {activity.map((entry) => (
              <Box
                key={entry.id}
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                  px: { xs: 2, md: 3 },
                  py: 1.75,
                }}
              >
                <Box
                  sx={(t) => ({
                    flexShrink: 0,
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    color: t.palette[ACCENTS[entry.type]].main,
                    bgcolor: alpha(
                      t.palette[ACCENTS[entry.type]].main,
                      t.palette.mode === "dark" ? 0.18 : 0.10,
                    ),
                    border: `1px solid ${alpha(
                      t.palette[ACCENTS[entry.type]].main,
                      0.22,
                    )}`,
                  })}
                >
                  {ICONS[entry.type]}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, fontSize: 14 }}>
                      {entry.title}
                    </Typography>
                    <Typography
                      sx={{ color: "text.disabled", fontSize: 11.5 }}
                    >
                      {formatRelativeTime(entry.timestamp)}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{ color: "text.secondary", fontSize: 13, mt: 0.25 }}
                  >
                    {entry.detail}
                  </Typography>
                  <Typography
                    sx={(t) => ({
                      color: t.palette[ACCENTS[entry.type]].main,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      mt: 0.5,
                    })}
                  >
                    {TYPE_LABEL[entry.type]} · {formatNoticeDate(entry.timestamp)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        {onClear && (
          <Button
            onClick={onClear}
            color="error"
            disabled={activity.length === 0}
            sx={{ fontWeight: 800, mr: "auto" }}
          >
            Clear log
          </Button>
        )}
        <Button onClick={onClose} sx={{ fontWeight: 800 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
