import { Box, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import type { GalleryImage } from "../../../services/Cloudinary";

type NoticeCardProps = {
  notice: GalleryImage;
};

function formatTitle(input: string): string {
  return input
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function NoticeCard({ notice }: NoticeCardProps) {
  const rawName = notice.display_name || notice.public_id.split("/").pop() || "Notice";
  const title = formatTitle(rawName);
  const postedDate = new Date(notice.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return (
    <Card sx={{ borderRadius: 3, overflow: "hidden", height: "100%" }}>
      <CardMedia
        component="img"
        image={notice.secure_url}
        alt={title}
        sx={{ aspectRatio: "16 / 9", objectFit: "cover" }}
      />
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Chip label="Notice" size="small" color="primary" />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {postedDate}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.35 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}
