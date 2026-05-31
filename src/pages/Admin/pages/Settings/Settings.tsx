import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Settings() {
  const [username, setUsername] = useState("admin");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{
    severity: "success" | "error";
    text: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const response = await fetch("/api/auth", {
          method: "GET",
          credentials: "same-origin",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (data?.username) {
          setUsername(String(data.username));
        }
      } catch {
        // ignore
      }
    };

    loadAuth();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setNotes([]);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({
        severity: "error",
        text: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        severity: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/auth", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage({
          severity: "success",
          text: "Password updated successfully.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        return;
      }

      if (response.status === 501) {
        setNotes([
          "Password changes are not enabled for this deployment.",
          "Configure ADMIN_USERS_FILE for persistent admin user management.",
        ]);
      }

      setMessage({
        severity: "error",
        text:
          typeof data?.error?.message === "string"
            ? data.error.message
            : "Unable to change password. Please check your credentials.",
      });
    } catch (error) {
      setMessage({
        severity: "error",
        text:
          error instanceof Error
            ? error.message
            : "Unable to change password. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }} elevation={2}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
          Admin Settings
        </Typography>
        <Typography sx={{ mb: 3, color: "text.secondary" }}>
          Use this page to update the admin password for the currently signed-in
          user. If password changes are not available in your deployment, the
          backend will show a guidance message.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Admin Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              fullWidth
              disabled={isSaving}
            />
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              fullWidth
              required
            />

            {message && (
              <Alert severity={message.severity}>{message.text}</Alert>
            )}
            {notes.length > 0 && (
              <Alert severity="info">
                <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                  {notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Button type="submit" variant="contained" disabled={isSaving}>
              {isSaving ? "Saving…" : "Change Password"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
