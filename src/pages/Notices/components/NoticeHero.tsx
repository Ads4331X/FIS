import { Box, Typography } from "@mui/material";

export function NoticeHero() {
  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Typography
        component="h1"
        sx={{
          fontWeight: 900,
          fontSize: { xs: "1.8rem", md: "2.4rem" },
          letterSpacing: "-0.02em",
          mb: 1,
        }}
      >
        School Notices
      </Typography>
      <Typography sx={{ color: "text.secondary", maxWidth: 760, mx: "auto" }}>
        Latest notices uploaded by the admin panel are published here automatically.
      </Typography>
    </Box>
  );
}
