import { Box } from "@mui/material";
import { Hero } from "../../components/ui/Hero";

export function AdmissionHero() {
  return (
    <Hero
      bgImg="/images/admission.jpg"
      centered
      title={
        <>
          Join the Fairyland Family
        </>
      }
      description="Embark on a journey of academic excellence and holistic development. Secure your child&apos;s future in an environment designed for modern success and traditional values."
      actions={
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
          {["100% Board Results", "15:1 Student Ratio"].map((item) => (
            <Box
              key={item}
              sx={{
                px: 1.5,
                py: 0.65,
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,.35)",
                bgcolor: "rgba(255,255,255,.16)",
                color: "#EAF3FF",
                fontSize: 12,
              }}
            >
              {item}
            </Box>
          ))}
        </Box>
      }
    />
  );
}
