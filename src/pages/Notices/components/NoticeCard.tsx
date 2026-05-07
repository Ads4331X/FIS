import { useMemo, useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import type { NoticeItem } from "../../../services/Cloudinary";

type NoticeCardProps = {
  notice: NoticeItem;
};

export function NoticeCard({ notice }: NoticeCardProps) {
  const postedDate = new Date(notice.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  const hasImage = Boolean(notice.imageUrl);
  const [expanded, setExpanded] = useState(false);
  const description = notice.description?.trim() ?? "";
  const descriptionLimit = 220;
  const shouldClamp = description.length > descriptionLimit;
  const shownDescription = useMemo(() => {
    if (!shouldClamp || expanded) return description;
    return `${description.slice(0, descriptionLimit).trimEnd()}...`;
  }, [description, expanded, shouldClamp]);

  return (
    <Card sx={{ borderRadius: 3, overflow: "hidden", width: "100%" }}>
      {hasImage && (
        <CardMedia
          component="img"
          image={notice.imageUrl}
          alt={notice.title}
          sx={{ aspectRatio: "16 / 9", objectFit: "cover" }}
        />
      )}
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Chip label={notice.category} size="small" color="primary" />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {postedDate}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.35 }}>
          {notice.title}
        </Typography>
        {description && (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            {shownDescription}
          </Typography>
        )}
        {shouldClamp && (
          <Button
            size="small"
            onClick={() => setExpanded((prev) => !prev)}
            sx={{ mt: 1, px: 0, minWidth: 0, textTransform: "none" }}
          >
            {expanded ? "Read less" : "Read more"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
