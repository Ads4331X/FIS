import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { Box } from "@mui/material";
import { StatCard } from "../../components/ui/StatCard";

export default function Stats() {
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
        width: "100%",
        alignItems: "stretch",
      }}
    >
      <StatCard
        tone="paper"
        icon={<GroupsOutlinedIcon sx={{ fontSize: 40 }} />}
        value="15:1"
        label="Student–Teacher Ratio"
      />
      <StatCard
        tone="paper"
        icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 40 }} />}
        value="100%"
        label="Board Examination Results"
      />
      <StatCard
        tone="paper"
        icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 40 }} />}
        value="25+"
        label="Extra-curricular Clubs"
      />
    </Box>
  );
}
