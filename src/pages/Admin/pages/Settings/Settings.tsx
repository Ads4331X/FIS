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
  const [currentUsername, setCurrentUsername] = useState("admin");
  const [newUsername, setNewUsername] = useState("");
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
          setCurrentUsername(String(data.username));
          setNewUsername("");
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

    if (!currentPassword) {
      setMessage({
        severity: "error",
        text: "Current password is required to update credentials.",
      });
      return;
    }

    const usernameUpdate =
      newUsername?.trim() && newUsername !== currentUsername;
    const passwordUpdate = Boolean(newPassword);

    if (!usernameUpdate && !passwordUpdate) {
      setMessage({
        severity: "error",
        text: "Please enter a new username or new password to update.",
      });
      return;
    }

    if (passwordUpdate && newPassword !== confirmPassword) {
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
          currentPassword,
          newUsername: usernameUpdate ? newUsername.trim() : undefined,
          newPassword: passwordUpdate ? newPassword : undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const successParts: string[] = [];
        if (usernameUpdate) successParts.push("Username updated");
        if (passwordUpdate) successParts.push("Password updated");

        setMessage({
          severity: "success",
          text:
            successParts.length > 0
              ? `${successParts.join(" and ")}.`
              : "Credentials updated successfully.",
        });
        if (
          typeof data?.username === "string" &&
          data.username !== currentUsername
        ) {
          setCurrentUsername(data.username);
          setNewUsername(data.username);
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        return;
      }

      if (response.status === 501) {
        setNotes([
          "Username changes are not enabled for this deployment.",
          "Configure ADMIN_USERS_FILE for persistent admin user management.",
        ]);
      }

      setMessage({
        severity: "error",
        text:
          typeof data?.error?.message === "string"
            ? data.error.message
            : "Unable to update username. Please check your credentials.",
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
          Use this page to update the signed-in admin user's username or
          password. You can update either one or both fields.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Current Username"
              value={currentUsername}
              fullWidth
              disabled
              autoComplete="username"
            />
            <TextField
              label="New Username"
              value={newUsername}
              onChange={(event) => setNewUsername(event.target.value)}
              fullWidth
              helperText="Enter a new username to update your admin account."
              autoComplete="username"
              disabled={isSaving}
            />
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              fullWidth
              required
              autoComplete="current-password"
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              fullWidth
              helperText="Leave blank to keep the current password."
              autoComplete="new-password"
              disabled={isSaving}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              fullWidth
              helperText="Confirm only if changing the password."
              autoComplete="new-password"
              disabled={isSaving}
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
              {isSaving ? "Saving…" : "Update Username"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
