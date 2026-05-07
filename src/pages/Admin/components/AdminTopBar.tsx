import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  IconButton,
  InputBase,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import type { AdminColorMode } from "../theme/adminTheme";

type AdminTopBarProps = {
  searchPlaceholder: string;
  showMenuButton: boolean;
  mode: AdminColorMode;
  onOpenMobileNav: () => void;
  onToggleMode: () => void;
  onLogout: () => void;
};

export function AdminTopBar({
  searchPlaceholder,
  showMenuButton,
  mode,
  onOpenMobileNav,
  onToggleMode,
  onLogout,
}: AdminTopBarProps) {
  return (
    <Box
      sx={(t) => ({
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(10px)",
        bgcolor: alpha(
          t.palette.background.default,
          t.palette.mode === "dark" ? 0.75 : 0.85,
        ),
        borderBottom: `1px solid ${alpha(t.palette.divider, 0.9)}`,
      })}
    >
      <Container maxWidth="xl" sx={{ py: 1.25 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          {showMenuButton && (
            <IconButton onClick={onOpenMobileNav} size="small">
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={(t) => ({
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.25,
              py: 0.9,
              borderRadius: 999,
              border: `1px solid ${alpha(t.palette.divider, 0.9)}`,
              bgcolor: alpha(
                t.palette.background.paper,
                t.palette.mode === "dark" ? 0.55 : 0.75,
              ),
              boxShadow:
                t.palette.mode === "dark"
                  ? "0 10px 24px rgba(0,0,0,0.35)"
                  : "0 10px 24px rgba(15,23,42,0.06)",
              transition: "border-color 200ms ease, box-shadow 200ms ease",
              "&:focus-within": {
                borderColor: alpha(t.palette.primary.main, 0.45),
                boxShadow:
                  t.palette.mode === "dark"
                    ? `0 12px 28px ${alpha(t.palette.primary.main, 0.18)}`
                    : `0 12px 28px ${alpha(t.palette.primary.main, 0.10)}`,
              },
            })}
          >
            <SearchIcon fontSize="small" />
            <InputBase
              placeholder={searchPlaceholder}
              sx={{ flex: 1, fontSize: 14 }}
              inputProps={{ "aria-label": searchPlaceholder }}
            />
          </Box>

          <IconButton
            size="small"
            sx={{
              transition: "transform 200ms ease",
              "&:hover": { transform: "translateY(-1px)" },
            }}
            aria-label="Notifications"
          >
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              transition: "transform 200ms ease",
              "&:hover": { transform: "translateY(-1px)" },
            }}
            aria-label="Help"
          >
            <HelpOutlineOutlinedIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={onToggleMode}
            sx={{
              transition: "transform 200ms ease",
              "&:hover": { transform: "translateY(-1px)" },
            }}
            aria-label="Toggle dark mode"
          >
            {mode === "dark" ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, opacity: 0.7, display: { xs: "none", sm: "block" } }}
          />

          <Chip
            icon={
              <Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>A</Avatar>
            }
            label="Admin"
            variant="outlined"
            sx={(t) => ({
              borderRadius: 999,
              pl: 0.5,
              pr: 0.75,
              height: 36,
              borderColor: alpha(t.palette.divider, 0.9),
              bgcolor: alpha(
                t.palette.background.paper,
                t.palette.mode === "dark" ? 0.50 : 0.70,
              ),
              display: { xs: "none", sm: "inline-flex" },
            })}
          />

          <IconButton
            size="small"
            onClick={onLogout}
            sx={(t) => ({
              ml: 0.25,
              borderRadius: 2,
              border: `1px solid ${alpha(t.palette.divider, 0.9)}`,
              bgcolor: alpha(
                t.palette.background.paper,
                t.palette.mode === "dark" ? 0.50 : 0.70,
              ),
              transition:
                "transform 200ms ease, background-color 200ms ease",
              "&:hover": {
                transform: "translateY(-1px)",
                bgcolor: alpha(t.palette.error.main, 0.08),
              },
            })}
            aria-label="Logout"
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
