import { Box } from "@mui/material";
import { Hero } from "../../components/ui/Hero";

export function AcademicsHero() {
  return (
    <Hero
      bgImg="/images/academics.jpg"
      badge="Academic Excellence"
      title={
        <>
          Shaping Tomorrow&apos;s Leaders{" "}
          <Box component="span" sx={{ fontWeight: 800 }}>
            with{" "}
            <Box
              component="span"
              sx={{ color: "rgba(247, 250, 255, 0.98)" }}
            >
              Integrity
            </Box>
          </Box>
        </>
      }
      description="At Fairyland Secondary School, we believe in a holistic curriculum designed to foster excellence through curiosity, discipline, and a commitment to moral values."
    />
  );
}
