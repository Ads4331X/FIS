import { Box, Container } from "@mui/material";

export function AcademicsHero() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        background: "url('/images/academics.jpg') center/cover no-repeat",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,28,58,0.9), rgba(0,28,58,0.6), rgba(0,28,58,0.2))",
          zIndex: 0,
        },
      }}
    >
      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ maxWidth: 600 }}>
          {/* badge */}
          <Box
            sx={{
              display: "inline-block",
              backgroundColor: "red",
              color: "white",
              px: 2,
              py: 0.5,
              borderRadius: "999px",
              fontSize: "0.75rem",
              mb: 2,
              fontWeight: "bold",
              letterSpacing: "0.1em",
            }}
          >
            Academic Excellence{" "}
          </Box>

          {/* title */}
          <Box
            component="h1"
            sx={{
              color: "white",
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 3,
            }}
          >
            Shaping Tomorrow's Leaders{" "}
            <Box component={"span"}>
              {" "}
              with <Box component={"span"}> Integrity</Box>
            </Box>
          </Box>

          {/* text */}
          <Box
            component="p"
            sx={{
              color: "#D4E3FF",
              fontSize: "1rem",
              maxWidth: 500,
            }}
          >
            At Fairyland Secondary School, we believe in a holistic curriculum
            designed to foster excellence through curiosity, discipline, and a
            commitment to moral values.
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
