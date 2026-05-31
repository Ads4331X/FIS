import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Drawer,
  ThemeProvider,
  alpha,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { findAdminSection } from "../config/sections";
import {
  buildAdminTheme,
  getStoredAdminMode,
  setStoredAdminMode,
  type AdminColorMode,
} from "../theme/adminTheme";

const SIDEBAR_WIDTH = 280;

export default function AdminLayout() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMdUp = useMediaQuery("(min-width:900px)");
  const [mode, setMode] = useState<AdminColorMode>(() => getStoredAdminMode());

  const theme = useMemo(() => buildAdminTheme(mode), [mode]);
  const activeSection = findAdminSection(location.pathname);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth", {
          method: "GET",
          credentials: "same-origin",
        });
        setLoggedIn(response.ok);
      } catch {
        setLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };

    verifyAuth();
  }, []);

  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "DELETE",
        credentials: "same-origin",
      });
    } catch {
      // ignore; user is still logged out locally
    }
    setLoggedIn(false);
  };

  const handleToggleMode = () => {
    const next: AdminColorMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    setStoredAdminMode(next);
  };

  if (!authChecked) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#F5F7FB",
          }}
        >
          <Typography variant="h6">Checking session…</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (!loggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LoginForm onLogin={() => setLoggedIn(true)} />
      </ThemeProvider>
    );
  }

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
              <AdminSidebar activeKey={activeSection.key} />
            </Box>
          ) : (
            <Drawer
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              ModalProps={{ keepMounted: true }}
              sx={{ "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH } }}
            >
              <AdminSidebar
                activeKey={activeSection.key}
                onNavigate={() => setMobileOpen(false)}
              />
            </Drawer>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AdminTopBar
              searchPlaceholder={`Search ${activeSection.label.toLowerCase()}…`}
              searchValue={searchQuery}
              showMenuButton={!isMdUp}
              mode={mode}
              onOpenMobileNav={() => setMobileOpen(true)}
              onSearchChange={setSearchQuery}
              onToggleMode={handleToggleMode}
              onLogout={handleLogout}
            />
            <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 } }}>
              <Outlet context={{ searchQuery, setSearchQuery }} />
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
