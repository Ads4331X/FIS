import { Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { StatCard } from "../../components/ui/StatCard";

export default function HomeSubContent() {
  const features = [
    {
      icon: <GroupsIcon sx={{ fontSize: 40 }} />,
      title: "15:1",
      description: "Student-Teacher Ratio",
    },
    {
      icon: <VerifiedOutlinedIcon sx={{ fontSize: 40 }} />,
      title: "100%",
      description: "Board Examination Results",
    },
    {
      icon: <EmojiEventsOutlinedIcon sx={{ fontSize: 40 }} />,
      title: "25+",
      description: "Extracurricular Activities",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
        gap: { xs: 2, md: 3 },
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 2.5, md: 3 },
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        alignItems: "stretch",
        backgroundColor: "#F9FAFB",
      }}
    >
      {features.map((feature, index) => (
        <StatCard
          key={index}
          tone="paper"
          icon={feature.icon}
          value={feature.title}
          label={feature.description}
        />
      ))}
    </Box>
  );
}
