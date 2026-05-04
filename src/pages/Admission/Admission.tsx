import { Box, Container, Typography } from "@mui/material";
import { AdmissionHero } from "./AdmissionHero";

export default function Admission() {
  return (
    <Box>
      <AdmissionHero />
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 }, px: 2 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: "#074783", mb: 2 }}>
          Admissions
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Application details, fees, and orientation schedules will appear here. For now, use the contact page or call the school to speak with our admissions team.
        </Typography>
      </Container>
    </Box>
  );
}
