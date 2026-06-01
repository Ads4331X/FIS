import { Box, Typography } from "@mui/material";

export function HeadStaffHeader() {
  return (
    <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
      <Typography
        component="h2"
        sx={{
          color: "#074783",
          fontWeight: 700,
          fontSize: { xs: "1.9rem", md: "2.4rem" },
          lineHeight: 1.05,
        }}
      >
        Head Staff
      </Typography>
      <Typography
        component="p"
        sx={{   
          color: "#4B5563",
          mt: 2,
          mx: "auto",
          maxWidth: 680,
          fontSize: { xs: "1rem", md: "1.05rem" },
          lineHeight: 1.75,
        }}
      >
        Meet the senior team who shape the school’s daily direction and lead
        core learning and operational excellence.
      </Typography>
    </Box>
  );
}
