import { Box } from "@mui/material";
import { AboutHero } from "./AboutHero";
import { OurMission } from "./OurMission";
import { EducationalJourney } from "./EducationalJourney";
import { ScheduleVisit } from "./ScheduleVisit";
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
