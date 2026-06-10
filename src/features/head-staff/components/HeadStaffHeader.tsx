import { Box, Typography } from "@mui/material";

export function HeadStaffHeader() {
  return (
    <Box sx={{ textAlign: "center", mb: { xs: 2, md: 4 } }}>
      {/* Eyebrow */}
      <Typography
        component="span"
        sx={{
          display: "inline-block",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#2878eb",
          bgcolor: "#eaf1fd",
          px: 1.5,
          py: 0.5,
          borderRadius: "20px",
          mb: 1.5,
        }}
      >
        Our Leadership
      </Typography>

      <Typography
        component="h2"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.25rem" },
          color: "#1a2b4a",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        Meet Our Head Staff
      </Typography>

      <Typography
        component="p"
        sx={{
          color: "#5a6e8c",
          mt: { xs: 1, md: 1.5 },
          mx: "auto",
          maxWidth: 520,
          fontSize: { xs: "0.9rem", sm: "1rem" },
          lineHeight: 1.75,
          px: { xs: 2, sm: 0 },
        }}
      >
        The senior team who shape our school's daily direction, lead academic
        excellence, and champion every student's growth.
      </Typography>
    </Box>
  );
}
