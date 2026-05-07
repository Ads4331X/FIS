import type { Theme } from "@mui/material";
import { alpha } from "@mui/material";
import type { NoticeCategory, NoticeStatus } from "./data";

const CATEGORY_HUES: Record<NoticeCategory, "info" | "success" | "warning" | "secondary" | "primary"> = {
  Event: "info",
  Sports: "secondary",
  Maintenance: "warning",
  Academic: "success",
  General: "primary",
};

export function getCategoryColors(theme: Theme, category: NoticeCategory) {
  const palette = theme.palette[CATEGORY_HUES[category]];
  return {
    bg: alpha(palette.main, theme.palette.mode === "dark" ? 0.22 : 0.12),
    fg: palette.main,
    border: alpha(palette.main, 0.28),
  };
}

export function getStatusColor(theme: Theme, status: NoticeStatus): string {
  if (status === "published") return theme.palette.success.main;
  return theme.palette.warning.main;
}
