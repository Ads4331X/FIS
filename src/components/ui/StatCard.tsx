import { Box } from "@mui/material";
import type { ReactNode } from "react";

export function StatCard({
  value,
  label,
  icon,
  variant = "legacy",
  tone = "brand",
}: {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
  variant?: "legacy" | "pass" | "eca";
  tone?: "brand" | "paper";
}) {
  const navy = "#002D5B";
  const sharedCardSx = {
    width: "100%",
    minWidth: 0,
    p: { xs: 3, md: 3.5 },
    borderRadius: 3,
    textAlign: "center" as const,
    transition: "0.25s",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
  };

  if (tone === "paper") {
    return (
      <Box
        sx={{
          ...sharedCardSx,
          bgcolor: "#fff",
          color: navy,
          boxShadow: "0 4px 20px rgba(15,23,42,0.08)",
          border: "1px solid #eef2f6",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 28px rgba(15,23,42,0.12)",
          },
        }}
      >
        <Box sx={{ color: navy, opacity: 0.92, mb: 1 }}>{icon}</Box>
        <Box sx={{ fontSize: { xs: "2rem", sm: "2.35rem" }, fontWeight: 800 }}>
          {value}
        </Box>
        <Box
          sx={{ fontSize: "0.9rem", fontWeight: 500, mt: 1, color: "#64748b" }}
        >
          {label}
        </Box>
      </Box>
    );
  }

  const styles = {
    legacy: {
      bg: "#0D4A86",
      text: "#ffffff",
      label: "#bfdbfe",
    },
    pass: {
      bg: "#FFB3AC",
      text: "#ffffff",
      label: "#FFEDEB",
    },
    eca: {
      bg: "#38873A",
      text: "#ffffff",
      label: "#C8FFBF",
    },
  };

  const s = styles[variant];

  return (
    <Box
      sx={{
        ...sharedCardSx,
        backgroundColor: s.bg,
        color: s.text,
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        "&:hover": {
          transform: "translateY(-6px)",
        },
      }}
    >
      <Box sx={{ fontSize: "3rem", fontWeight: 800 }}>{value}</Box>

      <Box
        sx={{ fontSize: "0.875rem", fontWeight: 500, mt: 1, color: s.label }}
      >
        {label}
      </Box>
    </Box>
  );
}
