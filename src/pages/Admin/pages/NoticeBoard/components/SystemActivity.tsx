import { Box, Button, Card, Divider, Stack, Typography, alpha } from "@mui/material";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlined";
import type { ReactElement } from "react";
import { formatRelativeTime, type NoticeActivity, type NoticeActivityType } from "../data";

type SystemActivityProps = {
  activity: NoticeActivity[];
  onViewAll?: () => void;
};

const ICONS: Record<NoticeActivityType, ReactElement> = {
  updated: <EditNoteOutlinedIcon fontSize="small" />,
  published: <CampaignOutlinedIcon fontSize="small" />,
  removed: <DeleteOutlineIcon fontSize="small" />,
  created: <AddCircleOutlineIcon fontSize="small" />,
};

const ACCENTS: Record<NoticeActivityType, "primary" | "success" | "error" | "info"> = {
  updated: "primary",
  published: "success",
  removed: "error",
  created: "info",
};

export function SystemActivity({ activity, onViewAll }: SystemActivityProps) {
  return (
    <Card
      variant="outlined"
      sx={(t) => ({
        borderRadius: 3,
        borderColor: alpha(t.palette.divider, 0.85),
        boxShadow:
          t.palette.mode === "dark"
            ? "0 18px 50px rgba(0,0,0,0.45)"
            : "0 18px 50px rgba(15,23,42,0.08)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      })}
    >
      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 900, letterSpacing: "-0.01em" }}>
          System Activity
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 12.5, mt: 0.25 }}>
          Recent changes across the notice board.
        </Typography>
      </Box>
      <Divider />

      <Stack
        spacing={0}
        sx={{ flex: 1, overflowY: "auto", maxHeight: { xs: "none", md: 320 } }}
      >
        {activity.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography sx={{ color: "text.secondary", fontSize: 13.5 }}>
              No activity yet.
            </Typography>
          </Box>
        ) : (
          activity.map((entry, index) => (
            <Box key={entry.id}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                  px: 2,
                  py: 1.5,
                }}
              >
                <Box
                  sx={(t) => ({
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    borderRadius: 2,
                    display: "grid",
                    placeItems: "center",
                    color: t.palette[ACCENTS[entry.type]].main,
                    bgcolor: alpha(
                      t.palette[ACCENTS[entry.type]].main,
                      t.palette.mode === "dark" ? 0.18 : 0.10,
                    ),
                    border: `1px solid ${alpha(t.palette[ACCENTS[entry.type]].main, 0.22)}`,
                  })}
                >
                  {ICONS[entry.type]}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.25 }}>
                    {entry.title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 12.5, mt: 0.25 }}>
                    {entry.detail}
                  </Typography>
                  <Typography sx={{ color: "text.disabled", fontSize: 11.5, mt: 0.25 }}>
                    {formatRelativeTime(entry.timestamp)}
                  </Typography>
                </Box>
              </Box>
              {index < activity.length - 1 && (
                <Divider sx={{ opacity: 0.6, mx: 2 }} />
              )}
            </Box>
          ))
        )}
      </Stack>

      <Divider />
      <Box sx={{ p: 1.25, textAlign: "center" }}>
        <Button
          size="small"
          onClick={onViewAll}
          disabled={!onViewAll}
          sx={{ fontWeight: 800 }}
        >
          View All Logs
        </Button>
      </Box>
    </Card>
  );
}
