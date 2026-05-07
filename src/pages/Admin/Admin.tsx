import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Tab,
  Tabs,
  ThemeProvider,
  Typography,
  createTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { ImageManager, type AdminGalleryStats, type AdminGalleryView } from "./components/ImageManager";
import { LoginForm } from "./components/LoginForm";
import { UploadZone } from "./components/UploadZone";
import { useLocation, useNavigate } from "react-router-dom";

type ColorMode = "light" | "dark";

const SIDEBAR_WIDTH = 280;
const ADMIN_SECTIONS = [
  {
    key: "overview",
    label: "Overview",
    path: "/admin/overview",
    icon: <DashboardOutlinedIcon fontSize="small" />,
    subtitle: "Track school-wide operational highlights from one place.",
  },
  {
    key: "studentmanagement",
    label: "Student Management",
    path: "/admin/studentmanagement",
    icon: <SchoolOutlinedIcon fontSize="small" />,
    subtitle: "Manage records, enrollment data, and student lifecycle updates.",
  },
  {
    key: "gallerymanagement",
    label: "Gallery Management",
    path: "/admin/gallerymanagement",
    icon: <PhotoLibraryOutlinedIcon fontSize="small" />,
    subtitle: "Organize and curate the digital memories of Fairyland Secondary.",
  },
  {
    key: "systemsettings",
    label: "System Settings",
    path: "/admin/systemsettings",
    icon: <SettingsOutlinedIcon fontSize="small" />,
    subtitle: "Configure portal behavior, preferences, and access controls.",
  },
] as const;

function getStoredMode(): ColorMode {
  const saved = localStorage.getItem("fis_admin_theme");
  return saved === "dark" ? "dark" : "light";
}

function setStoredMode(mode: ColorMode) {
  localStorage.setItem("fis_admin_theme", mode);
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 MB";
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

function StatCard({
  title,
  value,
  subtitle,
  accent = "primary",
}: {
  title: string;
  value: string;
  subtitle: string;
  accent?: "primary" | "info" | "success";
}) {
  return (
    <Card
      variant="outlined"
      sx={(t) => ({
        borderRadius: 3,
        p: 2.25,
        overflow: "hidden",
        position: "relative",
        bgcolor:
          t.palette.mode === "dark"
            ? alpha(t.palette.background.paper, 0.92)
            : t.palette.background.paper,
        borderColor: alpha(t.palette.divider, 0.8),
        boxShadow:
          t.palette.mode === "dark"
            ? "0 10px 30px rgba(0,0,0,0.35)"
            : "0 14px 40px rgba(15,23,42,0.10)",
        transition: "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
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
      <Box sx={{ position: "relative", display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography sx={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary" }}>
          {title}
        </Typography>
        <Typography sx={{ fontWeight: 900, fontSize: 26, letterSpacing: "-0.02em" }}>
          {value}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 12.5 }}>
          {subtitle}
        </Typography>
      </Box>
    </Card>
  );
}

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("fis_admin") === "1"
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState<AdminGalleryStats>({
    loadedAssets: 0,
    loadedBytes: 0,
    hasMore: false,
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMdUp = useMediaQuery("(min-width:900px)");
  const [mode, setMode] = useState<ColorMode>(() => getStoredMode());
  const currentSectionKey = location.pathname.split("/")[2] || "gallerymanagement";
  const activeSection =
    ADMIN_SECTIONS.find((section) => section.key === currentSectionKey) ??
    ADMIN_SECTIONS[2];
  const isGallerySection = activeSection.key === "gallerymanagement";

  const logout = () => {
    sessionStorage.removeItem("fis_admin");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <LoginForm onLogin={() => setLoggedIn(true)} />;
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#0A4D8C" },
          secondary: { main: "#B91C1C" },
          background: {
            default: mode === "dark" ? "#0B1220" : "#F6F7FB",
            paper: mode === "dark" ? "#0F1A2E" : "#FFFFFF",
          },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 12,
                fontWeight: 700,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },
        },
      }),
    [mode],
  );

  const sidebar = (
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 1, pt: 0.5 }}>
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
          <Typography sx={{ fontWeight: 900, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
            Fairyland
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
            Secondary · Admin Portal
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 0.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
        {ADMIN_SECTIONS.map((item) => (
          <Button
            key={item.label}
            variant="text"
            startIcon={item.icon}
            disableElevation
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={(t) => ({
              justifyContent: "flex-start",
              px: 1.25,
              py: 1,
              color: activeSection.key === item.key ? t.palette.primary.main : t.palette.text.secondary,
              bgcolor: activeSection.key === item.key ? alpha(t.palette.primary.main, 0.10) : "transparent",
              border: `1px solid ${activeSection.key === item.key ? alpha(t.palette.primary.main, 0.18) : "transparent"}`,
              "&:hover": {
                bgcolor: activeSection.key === item.key ? alpha(t.palette.primary.main, 0.14) : alpha(t.palette.text.primary, 0.04),
                transform: "translateY(-1px)",
              },
              transition: "transform 200ms ease, background-color 200ms ease, border-color 200ms ease",
            })}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      <Box sx={{ flex: 1 }} />

      <Card
        variant="outlined"
        sx={(t) => ({
          p: 2,
          borderRadius: 3,
          bgcolor: alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.10 : 0.06),
          borderColor: alpha(t.palette.primary.main, 0.16),
        })}
      >
        <Typography sx={{ fontWeight: 900, fontSize: 13.5, letterSpacing: "-0.01em" }}>
          Generate Report
        </Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5, mb: 1.5 }}>
          Export a quick summary of recent uploads.
        </Typography>
        <Button fullWidth variant="contained" sx={{ borderRadius: 2 }}>
          Generate
        </Button>
      </Card>
    </Box>
  );

  const tabViews: { label: string; view: AdminGalleryView }[] = [
    { label: "All", view: "all" },
    { label: "By Category", view: "category" },
  ];
  const activeView = tabViews[tab]?.view ?? "all";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          {isMdUp ? (
            <Box
              sx={(t) => ({
                width: SIDEBAR_WIDTH,
                flex: "0 0 auto",
                borderRight: `1px solid ${alpha(t.palette.divider, 0.9)}`,
                position: "sticky",
                top: 0,
                alignSelf: "flex-start",
                height: "100vh",
              })}
            >
              {sidebar}
            </Box>
          ) : (
            <Drawer
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{ "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH } }}
            >
              {sidebar}
            </Drawer>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Top bar */}
            <Box
              sx={(t) => ({
                position: "sticky",
                top: 0,
                zIndex: 10,
                backdropFilter: "blur(10px)",
                bgcolor: alpha(t.palette.background.default, t.palette.mode === "dark" ? 0.75 : 0.85),
                borderBottom: `1px solid ${alpha(t.palette.divider, 0.9)}`,
              })}
            >
              <Container maxWidth="xl" sx={{ py: 1.25 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  {!isMdUp && (
                    <IconButton onClick={() => setMobileOpen(true)} size="small">
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
                      bgcolor: alpha(t.palette.background.paper, t.palette.mode === "dark" ? 0.55 : 0.75),
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
                      placeholder={`Search ${activeSection.label.toLowerCase()}…`}
                      sx={{ flex: 1, fontSize: 14 }}
                      inputProps={{ "aria-label": `Search ${activeSection.label}` }}
                    />
                  </Box>

                  <IconButton size="small" sx={{ transition: "transform 200ms ease", "&:hover": { transform: "translateY(-1px)" } }}>
                    <NotificationsNoneIcon />
                  </IconButton>
                  <IconButton size="small" sx={{ transition: "transform 200ms ease", "&:hover": { transform: "translateY(-1px)" } }}>
                    <HelpOutlineOutlinedIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      const next: ColorMode = mode === "dark" ? "light" : "dark";
                      setMode(next);
                      setStoredMode(next);
                    }}
                    sx={{ transition: "transform 200ms ease", "&:hover": { transform: "translateY(-1px)" } }}
                    aria-label="Toggle dark mode"
                  >
                    {mode === "dark" ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
                  </IconButton>

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5, opacity: 0.7 }} />

                  <Chip
                    icon={<Avatar sx={{ width: 22, height: 22, fontSize: 12 }}>A</Avatar>}
                    label="Admin"
                    variant="outlined"
                    sx={(t) => ({
                      borderRadius: 999,
                      pl: 0.5,
                      pr: 0.75,
                      height: 36,
                      borderColor: alpha(t.palette.divider, 0.9),
                      bgcolor: alpha(t.palette.background.paper, t.palette.mode === "dark" ? 0.50 : 0.70),
                    })}
                  />

                  <IconButton
                    size="small"
                    onClick={logout}
                    sx={(t) => ({
                      ml: 0.25,
                      borderRadius: 2,
                      border: `1px solid ${alpha(t.palette.divider, 0.9)}`,
                      bgcolor: alpha(t.palette.background.paper, t.palette.mode === "dark" ? 0.50 : 0.70),
                      transition: "transform 200ms ease, background-color 200ms ease",
                      "&:hover": { transform: "translateY(-1px)", bgcolor: alpha(t.palette.error.main, 0.08) },
                    })}
                    aria-label="Logout"
                  >
                    <LogoutIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Container>
            </Box>

            {/* Main content */}
            <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 } }}>
              <Box
                sx={{
                  mb: { xs: 2, md: 3 },
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 950, letterSpacing: "-0.02em", fontSize: { xs: 22, md: 26 }, mb: 0.5 }}>
                    {activeSection.label}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", maxWidth: 720, lineHeight: 1.7 }}>
                    {activeSection.subtitle}
                  </Typography>
                </Box>

                {isGallerySection && (
                  <Box sx={{ display: "flex", gap: 1.25, width: { xs: "100%", md: "auto" } }}>
                    <Button
                      fullWidth={!isMdUp}
                      variant="outlined"
                      startIcon={<FilterAltOutlinedIcon />}
                      sx={(t) => ({
                        borderColor: alpha(t.palette.divider, 0.9),
                        bgcolor: alpha(t.palette.background.paper, t.palette.mode === "dark" ? 0.45 : 0.65),
                        "&:hover": { bgcolor: alpha(t.palette.background.paper, 0.9) },
                      })}
                    >
                      Filter
                    </Button>
                    <Button
                      fullWidth={!isMdUp}
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={(t) => ({
                        borderRadius: 2,
                        boxShadow: `0 14px 40px ${alpha(t.palette.primary.main, t.palette.mode === "dark" ? 0.22 : 0.18)}`,
                      })}
                    >
                      New Collection
                    </Button>
                  </Box>
                )}
              </Box>

              {isGallerySection ? (
                <>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", lg: "1.45fr 0.55fr" },
                      gap: 2.25,
                      alignItems: "start",
                    }}
                  >
                    <Box>
                      <UploadZone onUploaded={() => setRefreshKey((k) => k + 1)} />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
                      <StatCard
                        title="Storage used"
                        value={formatBytes(stats.loadedBytes)}
                        subtitle={stats.hasMore ? "From currently loaded images (more available)" : "From currently loaded images"}
                        accent="info"
                      />
                      <StatCard
                        title="Total assets"
                        value={String(stats.loadedAssets)}
                        subtitle={stats.hasMore ? "Loaded so far (next pages available)" : "Loaded in current view"}
                        accent="primary"
                      />
                    </Box>
                  </Box>

                  <Box sx={{ mt: { xs: 2.25, md: 3 } }}>
                    <Tabs
                      value={tab}
                      onChange={(_, v) => setTab(v)}
                      sx={(t) => ({
                        "& .MuiTabs-indicator": {
                          height: 3,
                          borderRadius: 999,
                          background: `linear-gradient(90deg, ${t.palette.primary.main}, ${alpha(t.palette.primary.main, 0.55)})`,
                        },
                        "& .MuiTab-root": {
                          textTransform: "none",
                          fontWeight: 800,
                          minHeight: 42,
                          px: 1.5,
                        },
                      })}
                    >
                      {tabViews.map((item) => (
                        <Tab key={item.view} label={item.label} />
                      ))}
                    </Tabs>
                    <Divider sx={{ mt: 1.25, mb: { xs: 2, md: 2.5 } }} />

                    <ImageManager
                      refreshKey={refreshKey}
                      viewMode={activeView}
                      onStatsChange={setStats}
                    />
                  </Box>
                </>
              ) : (
                <Card
                  variant="outlined"
                  sx={(t) => ({
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    borderColor: alpha(t.palette.divider, 0.85),
                    boxShadow:
                      t.palette.mode === "dark"
                        ? "0 18px 50px rgba(0,0,0,0.45)"
                        : "0 18px 50px rgba(15,23,42,0.08)",
                  })}
                >
                  <Typography sx={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", mb: 1 }}>
                    {activeSection.label}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                    This section is now routed and ready at `{activeSection.path}`.
                    I can build this page next with the same premium admin style.
                  </Typography>
                </Card>
              )}
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}