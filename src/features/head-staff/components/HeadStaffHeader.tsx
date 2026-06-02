import { Box, Typography } from "@mui/material";

export function HeadStaffHeader() {
  return (
    <Box sx={{ textAlign: "center", mb: { xs: 2, md: 4 } }}>
      <Typography
        component="h2"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.25rem" },
          color: "text.primary",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        Head Staff
      </Typography>
      <Typography
        component="p"
        sx={{
          color: "text.secondary",
          mt: { xs: 1, md: 1.5 },
          mx: "auto",
          maxWidth: 560,
          fontSize: { xs: "0.9rem", sm: "1rem", md: "1.05rem" },
          lineHeight: 1.7,
          px: { xs: 2, sm: 0 },
        }}
      >
        Meet the senior team who shape the school’s daily direction and lead
        core learning and operational excellence.
      </Typography>
    </Box>
  );
}
