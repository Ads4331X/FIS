import { Box, Button, Chip, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

type AdminHeaderProps = {
  onLogout: () => void;
};

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <Box
      sx={{
        bgcolor: "#074783",
        color: "white",
        px: { xs: 2, md: 4 },
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <AdminPanelSettingsIcon />
        <Box>
          <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>Gallery Admin</Typography>
          <Typography sx={{ fontSize: "0.75rem", opacity: 0.75 }}>Fairyland Secondary School</Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Chip label="admin" size="small" sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white", fontSize: "0.75rem" }} />
        <Button
          variant="outlined"
          size="small"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{ color: "white", borderColor: "rgba(255,255,255,0.4)", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
