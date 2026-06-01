import { Box, Container, Button } from "@mui/material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { siteContact } from "../../../constants/siteContact";

function isAdmissionOpen(): boolean {
  const month = new Date().getMonth() + 1;
  return month >= 4 && month <= 6;
}

export function ScheduleVisit() {
  const admissionOpen = isAdmissionOpen();

  const handleDownloadProspectus = () => {
    const a = document.createElement("a");
    a.href = siteContact.prospectusUrl;
    a.download = siteContact.prospectusFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 0, sm: 2 },
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: { xs: 0, sm: "16px", md: "24px" },
          mt: { xs: 0, sm: 4 },

          px: { xs: 3, sm: 5, md: 10 },
          py: { xs: 5, sm: 7, md: 10 },

          background: `
            radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.07) 0%, transparent 55%),
            radial-gradient(ellipse at 0% 110%, rgba(88,40,140,0.4) 0%, transparent 55%),
            #0e3d74
          `,
          textAlign: "center",
          color: "white",
        }}
      >
        {/*  blurred circle */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(88,40,140,0.25)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        {/* content */}
        <Box
          sx={{ position: "relative", zIndex: 1, maxWidth: 640, mx: "auto" }}
        >
          {/* admission badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
              px: 2,
              py: 0.75,
              borderRadius: "100px",
              border: `1px solid ${admissionOpen ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"}`,
              backgroundColor: admissionOpen
                ? "rgba(255,255,255,0.07)"
                : "rgba(255,255,255,0.04)",
              fontSize: { xs: "0.65rem", md: "0.75rem" },
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: admissionOpen
                ? "rgba(255,255,255,0.7)"
                : "rgba(255,255,255,0.35)",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: admissionOpen ? "#4ade80" : "#94a3b8",
                boxShadow: admissionOpen ? "0 0 6px #4ade80" : "none",
              }}
            />
            {admissionOpen ? "Admissions Open" : "Admissions Closed"}
          </Box>

          {/* heading */}
          <Box
            component="h1"
            sx={{
              m: 0,
              mb: 2,
              fontSize: { xs: "1.6rem", sm: "2.2rem", md: "3rem" },
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Start Your Success Story Today
          </Box>

          {/* subtext */}
          <Box
            component="p"
            sx={{
              m: 0,
              mb: { xs: 4, md: 5 },
              fontSize: { xs: "0.88rem", sm: "0.95rem", md: "1.1rem" },
              lineHeight: 1.8,
              color: "rgba(219,234,254,0.85)",
              maxWidth: 500,
              mx: "auto",
            }}
          >
            Join a community in pollution free Kapan dedicated to academic
            rigour, creative expression, and moral integrity where every child
            is seen, heard, and inspired.
          </Box>

          {/* buttons */}
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
              href={admissionOpen ? "/apply_now" : undefined}
              disabled={!admissionOpen}
              endIcon={<ArrowRightAltIcon />}
              sx={{
                backgroundColor: "#BA1A20",
                color: "white",
                px: { xs: 3, md: 4 },
                py: 1.75,
                width: { xs: "100%", sm: "auto" },
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: { xs: "0.88rem", md: "0.95rem" },
                letterSpacing: "0.02em",
                boxShadow: admissionOpen
                  ? "0 4px 24px rgba(186,26,32,0.45)"
                  : "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#DD3735",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 28px rgba(186,26,32,0.5)",
                },
                "&:active": { transform: "scale(0.96)" },
                "&:focus, &.Mui-focusVisible": { outline: "none" },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(186,26,32,0.3)",
                  color: "rgba(255,255,255,0.35)",
                },
              }}
            >
              {admissionOpen ? "Apply Now" : "Applications Closed"}
            </Button>

            <Button
              disableRipple
              onClick={handleDownloadProspectus}
              endIcon={<DownloadOutlinedIcon />}
              sx={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "white",
                px: { xs: 3, md: 4 },
                py: 1.75,
                width: { xs: "100%", sm: "auto" },
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: { xs: "0.88rem", md: "0.95rem" },
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                  transform: "translateY(-2px)",
                },
                "&:active": { transform: "scale(0.96)" },
              }}
            >
              Download Prospectus
            </Button>
          </Box>

          {/* trust note */}
          <Box
            sx={{
              mt: { xs: 4, md: 5 },
              fontSize: { xs: "0.72rem", md: "0.78rem" },
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.05em",
              lineHeight: 1.6,
            }}
          >
            {admissionOpen
              ? "No application fee · Seats are limited · Results within 7 days"
              : "Check back in April for the next admission cycle"}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
