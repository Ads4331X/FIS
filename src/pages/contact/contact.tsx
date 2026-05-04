import { Box, Container } from "@mui/material";
import { Hero } from "../../component/Hero";
import Aside from "./aside";
import Form from "./form";
import ContactMap from "./map";
import Stats from "./stats";

export default function Contact() {
  return (
    <Box sx={{ bgcolor: "#F9FAFB" }}>
      <Hero
        bgImg="/images/school.jpg"
        title="Connect With Us"
        description="We are here to help you navigate your educational journey. Reach out to our admissions team or visit our campus in Budhanilkantha."
        centered
        compact
        blurBackground
      />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            mt: { xs: -4, md: -8 },
            px: { xs: 2, sm: 0 },
            pb: { xs: 2, md: 1 },
            display: "grid",
            gap: { xs: 2.5, md: 3 },
            alignItems: "start",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.08fr) minmax(0, 1fr)" },
            gridTemplateAreas: {
              xs: `"form"\n "map"\n "aside"`,
              md: `"form aside"\n "map map"`,
            },
          }}
        >
          <Box sx={{ gridArea: "form" }}>
            <Form />
          </Box>
          <Box sx={{ gridArea: "aside" }}>
            <Aside />
          </Box>
          <Box sx={{ gridArea: "map", width: "100%", minWidth: 0 }}>
            <ContactMap />
          </Box>
        </Box>
        <Stats />
      </Container>
    </Box>
  );
}
