import { Box, CircularProgress, Typography } from "@mui/material";
import type { GalleryImage } from "../../../services/Cloudinary";
import { NoticeCard } from "./NoticeCard";

type NoticeGridProps = {
  loading: boolean;
  notices: GalleryImage[];
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
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
        gap: 2.5,
      }}
    >
      {notices.map((notice) => (
        <NoticeCard key={notice.public_id} notice={notice} />
      ))}
    </Box>
  );
}
