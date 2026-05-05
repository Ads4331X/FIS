import { Box, Card, Typography } from "@mui/material";

export function AdmissionBottomBanner() {
  return (
    <Card sx={{ borderRadius: 5, mt: 4.5, overflow: "hidden" }}>
      <Box sx={{ position: "relative", minHeight: { xs: 220, sm: 270 }, backgroundImage: "url('/images/admission_below.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,74,136,.85), rgba(15,74,136,.3), transparent)" }} />
        <Box sx={{ position: "relative", zIndex: 1, p: { xs: 2.75, md: 4 }, maxWidth: 460, color: "white" }}>
          <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.7rem", md: "2rem" } }}>
            A Community Built on Excellence
          </Typography>
          <Typography sx={{ mt: 1.2, color: "rgba(255,255,255,.9)" }}>
            Experience the Fairyland difference where every student is mentored to achieve their highest potential.
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
