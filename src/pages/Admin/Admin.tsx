import { useState } from "react";
import { Box, Container, Divider } from "@mui/material";
import { AdminHeader } from "./components/AdminHeader";
import { ImageManager } from "./components/ImageManager";
import { LoginForm } from "./components/LoginForm";
import { UploadZone } from "./components/UploadZone";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(
    sessionStorage.getItem("fis_admin") === "1"
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const logout = () => {
    sessionStorage.removeItem("fis_admin");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <LoginForm onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh" }}>
      <AdminHeader onLogout={logout} />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <UploadZone onUploaded={() => setRefreshKey((k) => k + 1)} />
        <Divider sx={{ my: 3 }} />
        <ImageManager refreshKey={refreshKey} />
      </Container>
    </Box>
  );
}