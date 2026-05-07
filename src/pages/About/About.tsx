import { Box } from "@mui/material";
import { AboutHero } from "./components/AboutHero";
import { OurMission } from "./components/OurMission";
import { EducationalJourney } from "./components/EducationalJourney";
import { ScheduleVisit } from "./components/ScheduleVisit";
export default function About() {
  return (
    <Box>
      <AboutHero />
      <OurMission />
      <Box
        sx={{
          background: "whitesmoke",
        }}
      >
        <EducationalJourney />
      </Box>
      <Box
        sx={{
          background: "white",
          marginBottom: "32px",
        }}
      >
        <ScheduleVisit />
      </Box>
    </Box>
  );
}
