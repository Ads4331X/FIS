import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import type { FormEvent } from "react";
import { useState } from "react";

const navy = "#002D5B";

const FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSc_U9Ge3smTuXI_vWwqytB0Ec2JiYSrFP6TD8Ss7-8asphb0A/formResponse";

const ENTRIES = {
  fullName: "entry.849957124",
  email: "entry.475501827",
  subject: "entry.1825927369",
  message: "entry.733328116",
} as const;

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#fafafa",
    minWidth: 0,
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#cbd5e1" },
  },
};

export default function Form() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [clientError, setClientError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setClientError(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      setClientError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setClientError("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    try {
      const body = new URLSearchParams({
        [ENTRIES.fullName]: trimmedName,
        [ENTRIES.email]: trimmedEmail,
        [ENTRIES.subject]: trimmedSubject,
        [ENTRIES.message]: trimmedMessage,
      });

      await fetch(FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      setStatus("sent");
      setFullName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        p: { xs: 2.5, sm: 4 },
        boxShadow: "0 8px 32px rgba(0,45,91,0.1)",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Typography
        sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.9rem", mb: 2.5 }}
      >
        Send us a Message
      </Typography>
      {clientError && (
        <Alert
          severity="warning"
          sx={{ mb: 2, wordBreak: "break-word" }}
          onClose={() => setClientError(null)}
        >
          {clientError}
        </Alert>
      )}
      {status === "sent" && (
        <Alert
          severity="success"
          sx={{ mb: 2, wordBreak: "break-word" }}
          onClose={() => setStatus("idle")}
        >
          Thank you — your message was submitted. We will get back to you soon.
        </Alert>
      )}
      {status === "error" && (
        <Alert
          severity="error"
          sx={{ mb: 2, wordBreak: "break-word" }}
          onClose={() => setStatus("idle")}
        >
          Something went wrong. Please try again or email us directly.
        </Alert>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          label="Full Name"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          sx={fieldSx}
        />
        <TextField
          fullWidth
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={fieldSx}
        />
      </Box>
      <TextField
        fullWidth
        label="Subject"
        placeholder="Inquiry about Admission"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        sx={{ ...fieldSx, mb: 2 }}
      />
      <TextField
        fullWidth
        multiline
        minRows={5}
        label="Message"
        placeholder="How can we help you?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ ...fieldSx, mb: 2.5 }}
      />
      <Button
        type="submit"
        fullWidth
        disabled={status === "sending"}
        sx={{
          bgcolor: navy,
          "&:hover": { bgcolor: "#001f3f" },
          "&.Mui-disabled": { bgcolor: navy, color: "#fff", opacity: 0.7 },
          color: "#fff",
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 700,
        }}
      >
        {status === "sending" ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          "Send Message"
        )}
      </Button>
    </Box>
  );
}
