import { Box, CircularProgress, Typography } from "@mui/material";
import type { NoticeItem } from "../../../services/Cloudinary";
import { NoticeCard } from "./NoticeCard";

type NoticeGridProps = {
  loading: boolean;
  notices: NoticeItem[];
};

export function NoticeGrid({ loading, notices }: NoticeGridProps) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notices.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", color: "text.secondary", py: 8 }}>
        No notices uploaded yet.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
      }}
    >
      {notices.map((notice) => (
        <NoticeCard key={notice.id} notice={notice} />
      ))}
    </Box>
  );
}
