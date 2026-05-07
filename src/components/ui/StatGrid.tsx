import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { ReactNode } from "react";
import { StatCard } from "./StatCard";

export type StatItem = {
  icon?: ReactNode;
  value: ReactNode;
  label: string;
};

export function StatGrid({
  items,
  sx,
}: {
  items: StatItem[];
  sx?: SxProps<Theme>;
}) {
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
        ...sx,
      }}
    >
      {items.map((item, i) => (
        <StatCard
          key={i}
          tone="paper"
          icon={item.icon}
          value={item.value}
          label={item.label}
        />
      ))}
    </Box>
  );
}
