import { Box } from "@mui/material";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { StatCard } from "../../components/ui/StatCard";

export default function Stats() {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: { xs: 2, md: 3 },
        py: { xs: 4, md: 6 },
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        /* Each stat card takes full width on xs, auto on larger */
        "& > *": {
          flex: { xs: "1 1 100%", sm: "1 1 200px" },
          maxWidth: { xs: "100%", sm: "260px" },
        },
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
