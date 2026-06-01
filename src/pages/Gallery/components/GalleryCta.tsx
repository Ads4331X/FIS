import { Box, Button, Container } from "@mui/material";
import { siteContact } from "../../../constants/siteContact";

export function GalleryCta() {
  return (
    <Box
      sx={{ bgcolor: "#F5F7FB", pt: { xs: 5, md: 7 }, pb: { xs: 6, md: 8 } }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          borderRadius: { xs: 0, sm: 3 },
          overflow: "hidden",
          background: "#001C3A",
          px: { xs: 3, sm: 6, md: 10 },
          py: { xs: 5, sm: 6, md: 7 },
          textAlign: "center",
          color: "white",
        }}
      >
        <Box
          component="h2"
          sx={{
            m: 0,
            fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.2rem" },
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          Be Part of Our Excellence
        </Box>
        <Box
          component="p"
          sx={{
            mt: 1.5,
            mb: { xs: 3, sm: 3.5 },
            mx: "auto",
            maxWidth: 700,
            color: "rgba(219,234,254,0.85)",
            fontSize: { xs: "0.9rem", md: "1rem" },
            lineHeight: 1.75,
          }}
        >
          Admissions are now open for the upcoming academic session. Join the
          Fairyland family today and secure your future.
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "center",
            alignItems: "stretch",
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
              fontWeight: 800,
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "#DD3735" },
              "&:active": {
                backgroundColor: "#DD3735",
                transform: "scale(0.96)",
              },
              "&:focus, &.Mui-focusVisible": { outline: "none" },
            }}
          >
            Apply Now
          </Button>

          <Button
            disableRipple
            onClick={() => {
              const a = document.createElement("a");
              a.href = siteContact.prospectusUrl;
              a.download = siteContact.prospectusFileName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            sx={{
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "white",
              px: 4,
              py: 1.5,
              width: { xs: "100%", sm: "fit-content" },
              borderRadius: "12px",
              fontWeight: 800,
              backdropFilter: "blur(12px)",
              transition: "all 0.3s ease",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              "&:active": {
                backgroundColor: "rgba(255,255,255,0.3)",
                transform: "scale(0.96)",
              },
            }}
          >
            Download Prospectus
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
