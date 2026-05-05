import { Box, Container, Typography } from "@mui/material";
import { useRef, type RefObject } from "react";
import { AcademicsHero } from "./AcademicsHero";
import Form from "../Contact/Form";
import { AcademicJourneySection } from "./AcademicJourneySection";
import { OurVisionSection } from "./OurVisionSection";
import { ResultsSection } from "./ResultsSection";

export default function Academics() {
  const journeySectionRef = useRef<HTMLElement | null>(null);
  const visionSectionRef = useRef<HTMLElement | null>(null);

  const scrollToSection = (sectionRef: RefObject<HTMLElement | null>) => {
    const targetY = sectionRef.current
      ? sectionRef.current.getBoundingClientRect().top + window.scrollY - 76
      : 0;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <Box sx={{ backgroundColor: "#F5F7FB" }}>
      <AcademicsHero
        onExploreCurriculum={() => scrollToSection(journeySectionRef)}
        onOurVision={() => scrollToSection(visionSectionRef)}
      />

      <Box
        ref={journeySectionRef}
        component="section"
        sx={{ backgroundColor: "#fff", py: { xs: 2, md: 3 } }}
      >
        <AcademicJourneySection sectionId="academic-journey" />
      </Box>

      <Box ref={visionSectionRef} component="section">
        <OurVisionSection sectionId="our-vision" />
      </Box>
      <ResultsSection sectionId="results-highlights" />

      <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            component="h2"
            sx={{
              textAlign: "center",
              color: "#0b2f57",
              fontWeight: 800,
              fontSize: { xs: "1.6rem", md: "2rem" },
              mb: 1,
            }}
          >
            Enroll Now
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              color: "#64748b",
              maxWidth: 640,
              mx: "auto",
              mb: 3.5,
              fontSize: { xs: "0.92rem", md: "1rem" },
            }}
          >
            Share your details and our admissions team will guide you through the
            next steps.
          </Typography>
          <Form />
        </Container>
      </Box>
    </Box>
  );
}
