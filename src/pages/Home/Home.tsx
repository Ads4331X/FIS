import { Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { StatGrid } from "../../components/ui/StatGrid";
import HomeHero from "./components/HomeHero";
import AcademicExcellence from "./components/AcademicExcellence";
import PrincipalMessage from "./components/LeadershipSection";
import ReadyToJoin from "./components/ReadyToJoin";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

const homeStats = [
  {
    icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    value: "15:1",
    label: "Student-Teacher Ratio",
  },
  {
    icon: <VerifiedOutlinedIcon sx={{ fontSize: 40 }} />,
    value: "100%",
    label: "Board Examination Results",
  },
  {
    icon: <SchoolOutlinedIcon sx={{ fontSize: 40 }} />,
    value: "15+",
    label: "Years of Experience",
  },
];

export default function Home() {
  return (
    <Box>
      <HomeHero />
      <Box sx={{ background: "#F9FAFB" }}>
        <StatGrid
          items={homeStats}
          sx={{
            px: { xs: 2, sm: 2.5, md: 3 },
            maxWidth: 1200,
            mx: "auto",
          }}
        />
      </Box>
      <PrincipalMessage />
      <AcademicExcellence />
      <ReadyToJoin />
    </Box>
  );
}
