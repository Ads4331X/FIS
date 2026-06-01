import { Container, Box, Button, Grid } from "@mui/material";

export default function ReadyToJoin() {
  const date = new Date();

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        padding: { xs: 0, sm: 2 },
        background: "#F5F7FB",
        py: 6,
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        height: "100%",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, whitesmoke, rgba(0, 28, 58, 0.4), rgba(255, 255, 255, 0))",
          zIndex: -1,
        },
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          background: "#001C3A",
          borderRadius: { xs: 0, sm: 3 },
          mt: { xs: 0, sm: 4 },
          overflow: "hidden",
        }}
      >
        <Grid container sx={{ minHeight: { md: 450 }, alignItems: "stretch" }}>
          {/* left side */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 3,
              padding: { xs: 4, sm: 6, md: 10 },
            }}
          >
            <Box
              component="h1"
              sx={{
                color: "white",
                fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2.2rem" },
                m: 0,
              }}
            >
              Ready to Join the{" "}
              <Box component="span" sx={{ color: "red" }}>
                Fairyland
              </Box>{" "}
              family?
            </Box>

            <Box
              component="p"
              sx={{
                color: "#7FADF0",
                m: 0,
                fontSize: { xs: "0.9rem", md: "1rem" },
                lineHeight: 1.7,
              }}
            >
              Admissions are now open for the {date.getFullYear()}–
              {date.getFullYear() + 1} academic year. Secure a seat for your
              child in a school that cares about their future.
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row", md: "column" },
                gap: 2,
              }}
            >
              <Button
                disableRipple
                variant="contained"
                href="/apply-now"
                sx={{
                  backgroundColor: "#BA1A20",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  width: { xs: "100%", sm: "fit-content" },
                  borderRadius: "12px",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                  "&:hover": { backgroundColor: "#DD3735" },
                  "&:active": {
                    backgroundColor: "#DD3735",
                    transform: "scale(0.95)",
                  },
                  "&:focus, &.Mui-focusVisible": { outline: "none" },
                }}
              >
                Apply Now
              </Button>

              <Button
                disableRipple
                href="/contact?visit=true"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  width: { xs: "100%", sm: "fit-content" },
                  borderRadius: "12px",
                  fontWeight: "bold",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.3s ease",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                  "&:active": {
                    backgroundColor: "rgba(255,255,255,0.3)",
                    transform: "scale(0.96)",
                  },
                }}
              >
                Schedule a Campus Visit
              </Button>
            </Box>
          </Grid>

          {/* right side */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              position: "relative",
              overflow: "hidden",
              minHeight: { xs: 220, sm: 300, md: "100%" },
            }}
          >
            {/* Image */}
            {/* Image */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "-30px", // extend image under left side
                right: 0,
                backgroundImage: "url('/images/readytojoin.png')",
                backgroundSize: "cover",
                backgroundPosition: "20% center",
                backgroundRepeat: "no-repeat",
              }}
            />

            {/* Smooth blend */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: `
        linear-gradient(
          90deg,
          #001C3A 0%,
          rgba(0, 28, 58, 0.85) 15%,
          rgba(0, 28, 58, 0.55) 30%,
          rgba(0, 28, 58, 0.25) 50%,
          rgba(0, 28, 58, 0.08) 70%,
          transparent 100%
        )
      `,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
