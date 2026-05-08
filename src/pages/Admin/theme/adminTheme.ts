import { createTheme } from "@mui/material";

export type AdminColorMode = "light" | "dark";

const STORAGE_KEY = "fis_admin_theme";

export function getStoredAdminMode(): AdminColorMode {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "dark" ? "dark" : "light";
}

export function setStoredAdminMode(mode: AdminColorMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, mode);
}

export function buildAdminTheme(mode: AdminColorMode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: "#0A4D8C" },
      secondary: { main: "#B91C1C" },
      success: { main: "#16A34A" },
      info: { main: "#2563EB" },
      warning: { main: "#D97706" },
      background: {
        default: mode === "dark" ? "#0B1220" : "#F6F7FB",
        paper: mode === "dark" ? "#0F1A2E" : "#FFFFFF",
      },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Merriweather", Georgia, "Times New Roman", serif',
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
  });
}
