import { Container, Box, Button, Grid } from "@mui/material";
export default function ReadyToJoin() {
  const date = new Date();

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        padding: 2,
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
        maxWidth={"lg"}
        disableGutters
        sx={{
          background: "#001C3A",
          borderRadius: 3,
          mt: 4,
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
              padding: 10,
            }}
          >
            <Box component="h1" sx={{ color: "white" }}>
              Ready to Join the{" "}
              <Box component="span" sx={{ color: "red" }}>
                Fairyland
              </Box>{" "}
              family?
            </Box>

            <Box component="p" sx={{ color: "#7FADF0" }}>
              Admissions are now open for the {date.getFullYear()}-
              {date.getFullYear() + 1} academic year. Secure a seat for your
              child in a school that cares about their future.
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                disableRipple
                variant="contained"
                sx={{
                  backgroundColor: "#BA1A20",
                  color: "white",
                  px: 4,
                  width: "fit-content",
                  py: 2,
                  borderRadius: "12px",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",

                  "&:hover": {
                    backgroundColor: "#DD3735",
                  },

                  "&:active": {
                    backgroundColor: "#DD3735",
                    transform: "scale(0.95)",
                  },

                  "&:focus": {
                    outline: "none",
                  },

                  "&.Mui-focusVisible": {
                    outline: "none",
                  },
                }}
              >
                Apply Now
              </Button>

              <Button
                disableRipple
                sx={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  color: "white",
                  px: 4,
                  py: 2,
                  width: "fit-content",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.3s ease",

                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)",
                  },

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
              minHeight: { xs: 300, md: "100%" },
            }}
          >
            {/* image */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                backgroundImage: "url('/images/readytojoin.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />

            {/* overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(0,28,58,0.85), rgba(0,28,58,0.4), rgba(0,28,58,0))",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
