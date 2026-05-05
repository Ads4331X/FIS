import { Box, Button } from "@mui/material";
import { Hero } from "../../components/ui/Hero";

type AcademicsHeroProps = {
  onExploreCurriculum?: () => void;
  onOurVision?: () => void;
};

export function AcademicsHero({
  onExploreCurriculum,
  onOurVision,
}: AcademicsHeroProps) {
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
      actions={
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            onClick={onExploreCurriculum}
            sx={{
              backgroundColor: "#fff",
              color: "#0b2f57",
              px: 2.25,
              py: 1,
              borderRadius: "10px",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { backgroundColor: "#eef4ff" },
            }}
          >
            Explore Curriculum
          </Button>
          <Button
            variant="outlined"
            onClick={onOurVision}
            sx={{
              borderColor: "rgba(255,255,255,0.45)",
              color: "#fff",
              px: 2.25,
              py: 1,
              borderRadius: "10px",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.08)" },
            }}
          >
            Our Vision
          </Button>
        </Box>
      }
    />
  );
}
