import { Box } from "@mui/material";
import HomeHero from "./HomeHero";
import HomeSubContent from "./HomeSubContent";
import AcademicExcellence from "./AcademicExcellence";
import ReadyToJoin from "./ReadyToJoin";
export default function Home() {
  return (
    <Box
      sx={{
        padding: 0,
        margin: 0,
      }}
    >
      <HomeHero />
      <Box sx={{ background: "#F9FAFB" }}>
        <HomeSubContent />
      </Box>
      <AcademicExcellence />
      <ReadyToJoin />
    </Box>
  );
}
