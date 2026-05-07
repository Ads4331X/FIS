import { Box } from "@mui/material";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutlined";
import { AdminStatCard } from "../../../components/AdminStatCard";
import type { Notice } from "../data";

export type NoticeStatFilter = "all" | "active-events" | "pending-drafts";

type NoticeStatsProps = {
  notices: Notice[];
  activeFilter: NoticeStatFilter;
  onFilterChange: (filter: NoticeStatFilter) => void;
};

export function NoticeStats({ notices, activeFilter, onFilterChange }: NoticeStatsProps) {
  const total = notices.length;
  const totalDisplay = total < 100 ? total.toString().padStart(3, "0") : String(total);
  const activeEvents = notices.filter(
    (n) => n.status === "published" && n.category === "Event",
  ).length;
  const drafts = notices.filter((n) => n.status === "draft").length;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
        mb: { xs: 2.5, md: 3 },
      }}
    >
      <AdminStatCard
        title="Total Notices"
        value={totalDisplay}
        accent="primary"
        active={activeFilter === "all"}
        onClick={() => onFilterChange("all")}
      />
      <AdminStatCard
        title="Active Events"
        value={String(activeEvents).padStart(2, "0")}
        accent="secondary"
        icon={<EventOutlinedIcon fontSize="small" />}
        active={activeFilter === "active-events"}
        onClick={() => onFilterChange("active-events")}
      />
      <AdminStatCard
        title="Pending Drafts"
        value={String(drafts).padStart(2, "0")}
        accent="warning"
        icon={<MailOutlineIcon fontSize="small" />}
        active={activeFilter === "pending-drafts"}
        onClick={() => onFilterChange("pending-drafts")}
      />
      <AdminStatCard
        title="Next Academic Term"
        value="Winter Session"
        subtitle="Registration ends in 14 days"
        accent="primary"
        filled
      />
    </Box>
  );
}
