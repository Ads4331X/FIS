import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
};

export function AdminPageHeader({
  title,
  subtitle,
  actions,
}: AdminPageHeaderProps) {
  return (
    <Box
      sx={{
        mb: { xs: 2, md: 3 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 950,
            letterSpacing: "-0.02em",
            fontSize: { xs: 22, md: 26 },
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{ color: "text.secondary", maxWidth: 720, lineHeight: 1.7 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {actions && (
        <Box
          sx={{
            display: "flex",
            gap: 1.25,
            width: { xs: "100%", md: "auto" },
            flexWrap: "wrap",
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  );
}
