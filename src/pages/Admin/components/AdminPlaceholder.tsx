import { Box, Card, Typography, alpha } from "@mui/material";
import { AdminPageHeader } from "./AdminPageHeader";

type AdminPlaceholderProps = {
  title: string;
  subtitle: string;
  message?: string;
};

export function AdminPlaceholder({
  title,
  subtitle,
  message,
}: AdminPlaceholderProps) {
  return (
    <Box>
      <AdminPageHeader title={title} subtitle={subtitle} />
      <Card
        variant="outlined"
        sx={(t) => ({
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          borderColor: alpha(t.palette.divider, 0.85),
          boxShadow:
            t.palette.mode === "dark"
              ? "0 18px 50px rgba(0,0,0,0.45)"
              : "0 18px 50px rgba(15,23,42,0.08)",
        })}
      >
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
          {message ??
            "This section is wired up and ready. The full experience can be built next using the same premium admin design system."}
        </Typography>
      </Card>
    </Box>
  );
}
