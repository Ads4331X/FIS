import { Box, Card, Typography, alpha } from "@mui/material";
import type { ReactNode } from "react";

export type AdminStatCardAccent =
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "secondary";

type AdminStatCardProps = {
  title: string;
  value: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  accent?: AdminStatCardAccent;
  /** When true, fill the card with the accent color (used for the highlighted card). */
  filled?: boolean;
  /** Optional small badge shown next to the value. */
  badge?: ReactNode;
};

export function AdminStatCard({
  title,
  value,
  subtitle,
  icon,
  accent = "primary",
  filled = false,
  badge,
}: AdminStatCardProps) {
  if (filled) {
    return (
      <Card
        sx={(t) => ({
          borderRadius: 3,
          p: 2.25,
          color: t.palette[accent].contrastText,
          bgcolor: t.palette[accent].main,
          backgroundImage: `linear-gradient(135deg, ${t.palette[accent].main} 0%, ${alpha(
            t.palette[accent].dark ?? t.palette[accent].main,
            0.92,
          )} 100%)`,
          boxShadow: `0 18px 40px ${alpha(t.palette[accent].main, 0.35)}`,
          transition: "transform 220ms ease, box-shadow 220ms ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 22px 50px ${alpha(t.palette[accent].main, 0.42)}`,
          },
        })}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em" }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: 12.5, opacity: 0.85 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      sx={(t) => ({
        borderRadius: 3,
        p: 2.25,
        position: "relative",
        overflow: "hidden",
        bgcolor:
          t.palette.mode === "dark"
            ? alpha(t.palette.background.paper, 0.92)
            : t.palette.background.paper,
        borderColor: alpha(t.palette.divider, 0.8),
        boxShadow:
          t.palette.mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.35)"
            : "0 14px 40px rgba(15,23,42,0.10)",
        transition:
          "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: alpha(t.palette[accent].main, 0.35),
          boxShadow:
            t.palette.mode === "dark"
              ? "0 14px 44px rgba(0,0,0,0.5)"
              : "0 18px 48px rgba(15,23,42,0.14)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `radial-gradient(900px 240px at 100% 0%, ${alpha(
            t.palette[accent].main,
            t.palette.mode === "dark" ? 0.22 : 0.14,
          )}, transparent 55%)`,
          pointerEvents: "none",
        },
      })}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            {title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography
              sx={{ fontWeight: 900, fontSize: 26, letterSpacing: "-0.02em" }}
            >
              {value}
            </Typography>
            {badge}
          </Box>
          {subtitle && (
            <Typography sx={{ color: "text.secondary", fontSize: 12.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {icon && (
          <Box
            sx={(t) => ({
              flexShrink: 0,
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              color: t.palette[accent].main,
              bgcolor: alpha(
                t.palette[accent].main,
                t.palette.mode === "dark" ? 0.18 : 0.10,
              ),
              border: `1px solid ${alpha(t.palette[accent].main, 0.22)}`,
            })}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Card>
  );
}
