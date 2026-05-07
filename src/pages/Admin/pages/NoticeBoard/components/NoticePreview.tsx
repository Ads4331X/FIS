import { Box, Button, Card, Chip, Typography, alpha } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EastIcon from "@mui/icons-material/East";
import { formatNoticeDate, type Notice } from "../data";
import { getCategoryColors } from "../categoryStyles";

type NoticePreviewProps = {
  notice: Notice | null;
  onReadMore?: (notice: Notice) => void;
};

export function NoticePreview({ notice, onReadMore }: NoticePreviewProps) {
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
        overflow: "hidden",
      })}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
        <VisibilityOutlinedIcon fontSize="small" color="primary" />
        <Typography sx={{ fontWeight: 900, letterSpacing: "-0.01em" }}>
          Notice Display Preview
        </Typography>
      </Box>

      {notice ? (
        <Box
          sx={(t) => ({
            mx: { xs: 1.5, md: 2 },
            mb: { xs: 1.5, md: 2 },
            border: `1px solid ${alpha(t.palette.divider, 0.85)}`,
            borderRadius: 2,
            overflow: "hidden",
            bgcolor:
              t.palette.mode === "dark"
                ? alpha(t.palette.background.paper, 0.6)
                : t.palette.background.paper,
          })}
        >
          {notice.imageUrl && (
            <Box
              sx={{
                aspectRatio: "16 / 9",
                width: "100%",
                bgcolor: "background.default",
                backgroundImage: `url(${notice.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              role="img"
              aria-label={notice.title}
            />
          )}
          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
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
                  mb: 1,
                };
              }}
            />
            <Typography sx={{ fontWeight: 950, letterSpacing: "-0.01em", fontSize: "1.15rem", mb: 0.75 }}>
              {notice.title}
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                mb: 2,
              }}
            >
              {notice.description}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
              <Typography sx={{ color: "text.secondary", fontSize: 12.5 }}>
                Posted {formatNoticeDate(notice.postedAt)}
              </Typography>
              <Button
                size="small"
                endIcon={<EastIcon fontSize="small" />}
                onClick={() => onReadMore?.(notice)}
                disabled={!onReadMore}
                sx={{ fontWeight: 800 }}
              >
                Read More
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: { xs: 3, md: 4 }, textAlign: "center" }}>
          <Typography sx={{ color: "text.secondary" }}>
            Publish a notice to see how it will appear to visitors.
          </Typography>
        </Box>
      )}
    </Card>
  );
}
