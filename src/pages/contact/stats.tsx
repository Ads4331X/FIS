import { Box } from "@mui/material";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { StatCard } from "../../components/ui/StatCard";

export default function Stats() {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: { xs: 2, md: 3 }, py: { xs: 4, md: 6 } }}>
      <StatCard tone="paper" icon={<GroupsOutlinedIcon sx={{ fontSize: 40 }} />} value="15:1" label="Student–Teacher Ratio" />
      <StatCard tone="paper" icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 40 }} />} value="100%" label="Board Examination Results" />
      <StatCard tone="paper" icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 40 }} />} value="25+" label="Extra-curricular Clubs" />
    </Box>
  );
}
