import { Avatar, Box, Button, Card, Typography, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ADMIN_SECTIONS, type AdminSection } from "../config/sections";

type AdminSidebarProps = {
  activeKey: AdminSection["key"];
  onNavigate?: () => void;
};

export function AdminSidebar({ activeKey, onNavigate }: AdminSidebarProps) {
  const navigate = useNavigate();

  return (
    <Box
      sx={(t) => ({
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        gap: 2,
        bgcolor: t.palette.background.paper,
      })}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          px: 1,
          pt: 0.5,
        }}
      >
        <Avatar
          sx={(t) => ({
            width: 36,
            height: 36,
            bgcolor: alpha(t.palette.primary.main, 0.12),
            color: t.palette.primary.main,
            fontWeight: 900,
            border: `1px solid ${alpha(t.palette.primary.main, 0.25)}`,
          })}
        >
          F
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 900,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            Fairyland
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
            Secondary · Admin Portal
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          px: 0.5,
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
          overflowY: "auto",
        }}
      >
        {ADMIN_SECTIONS.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <Button
              key={item.key}
              variant="text"
              startIcon={item.icon}
              disableElevation
              onClick={() => {
                navigate(item.path);
                onNavigate?.();
              }}
              sx={(t) => ({
                justifyContent: "flex-start",
                px: 1.25,
                py: 1,
                color: isActive
                  ? t.palette.primary.main
                  : t.palette.text.secondary,
                bgcolor: isActive
                  ? alpha(t.palette.primary.main, 0.10)
                  : "transparent",
                border: `1px solid ${
                  isActive ? alpha(t.palette.primary.main, 0.18) : "transparent"
                }`,
                "&:hover": {
                  bgcolor: isActive
                    ? alpha(t.palette.primary.main, 0.14)
                    : alpha(t.palette.text.primary, 0.04),
                  transform: "translateY(-1px)",
                },
                transition:
                  "transform 200ms ease, background-color 200ms ease, border-color 200ms ease",
              })}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>

      <Box sx={{ flex: 1 }} />

      <Card
        variant="outlined"
        sx={(t) => ({
          p: 2,
          borderRadius: 3,
          bgcolor: alpha(
            t.palette.primary.main,
            t.palette.mode === "dark" ? 0.10 : 0.06,
          ),
          borderColor: alpha(t.palette.primary.main, 0.16),
        })}
      >
        <Typography
          sx={{ fontWeight: 900, fontSize: 13.5, letterSpacing: "-0.01em" }}
        >
          Generate Report
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            color: "text.secondary",
            mt: 0.5,
            mb: 1.5,
          }}
        >
          Export a quick summary of recent activity.
        </Typography>
        <Button fullWidth variant="contained" sx={{ borderRadius: 2 }}>
          Generate
        </Button>
      </Card>
    </Box>
  );
}
