import { useRef, useEffect } from "react";
import { CountUp } from "countup.js";
import { Box } from "@mui/material";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { StatCard } from "./StatCard";

export function Counter() {
  const ref = useRef<HTMLDivElement | null>(null);

  const r1 = useRef<HTMLSpanElement | null>(null);
  const r2 = useRef<HTMLSpanElement | null>(null);
  const r3 = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (r1.current) {
          new CountUp(r1.current, 15, { suffix: "+" }).start();
        }

        if (r2.current) {
          new CountUp(r2.current, 100, { suffix: "%" }).start();
        }

        if (r3.current) {
          new CountUp(r3.current, 25, { suffix: "+" }).start();
        }

        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
        gap: { xs: 2, md: 3 },
        gridAutoRows: "1fr",
        py: { xs: 4, md: 6 },
        width: "100%",
        alignItems: "stretch",
      }}
    >
      <StatCard
        tone="paper"
        icon={<GroupsOutlinedIcon sx={{ fontSize: 40 }} />}
        label="Years of Legacy"
        value={<Box ref={r1}>0</Box>}
      />

      <StatCard
        tone="paper"
        icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 40 }} />}
        label="Board Pass Rate"
        value={<Box ref={r2}>0</Box>}
      />

      <StatCard
        tone="paper"
        icon={<EmojiEventsOutlinedIcon sx={{ fontSize: 40 }} />}
        label="ECA Activities"
        value={<Box ref={r3}>0</Box>}
      />
    </Box>
  );
}
