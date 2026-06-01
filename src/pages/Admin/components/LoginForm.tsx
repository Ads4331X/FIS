import { useState } from "react";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { SITE_NAME } from "../../../constants/siteContact";

type LoginFormProps = {
  onLogin: () => void;
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        onLogin();
        return;
      }

      if (response.status === 401) {
        setError("Invalid username or password.");
        return;
      }

      setError("Unable to login. Please try again.");
    } catch {
      setError("Unable to login. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F5F7FB",
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          p: { xs: 3, sm: 5 },
          boxShadow: "0 8px 40px rgba(0,28,58,0.12)",
          width: "100%",
          maxWidth: 420,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <AdminPanelSettingsIcon sx={{ color: "#074783", fontSize: 36 }} />
          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                color: "#074783",
                fontSize: "1.2rem",
                lineHeight: 1.2,
              }}
            >
              Admin Panel
            </Typography>
            <Typography sx={{ color: "#9ca3af", fontSize: "0.8rem" }}>
              {SITE_NAME}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          sx={{ mb: 2 }}
          required
          autoComplete="username"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          sx={{ mb: 3 }}
          required
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isSubmitting}
          sx={{
            py: 1.5,
            bgcolor: "#074783",
            borderRadius: 2,
            fontWeight: 700,
            "&:hover": { bgcolor: "#0a5a9e" },
            opacity: isSubmitting ? 0.9 : 1,
          }}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </Box>
    </Box>
  );
}
