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
const VISIT_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLScTx6qIH3Qbj8eFwSvOSekbLRjRNHOLLtufTODsF40GHb8jFA/formResponse";

const ENTRIES = {
  fullName: "entry.849957124",
  email: "entry.475501827",
  subject: "entry.1825927369",
  message: "entry.733328116",
} as const;
const VISIT_ENTRIES = {
  fullName: "entry.1356999789",
  email: "entry.808744274",
  preferredDate: "entry.308476997",
  preferredTime: "entry.372919032",
  message: "entry.67393148",
} as const;

const VISIT_SUBJECT = "Schedule a Visit";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#fafafa",
    minWidth: 0,
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#cbd5e1" },
  },
};

export default function Form({
  isVisitRequest = false,
}: {
  isVisitRequest?: boolean;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
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
    const trimmedDate = preferredDate.trim();
    const trimmedTime = preferredTime.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setClientError("Please fill in all fields.");
      return;
    }
    if (!isVisitRequest && !trimmedSubject) {
      setClientError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setClientError("Please enter a valid email address.");
      return;
    }
    if (isVisitRequest && (!trimmedDate || !trimmedTime)) {
      setClientError("Please provide your preferred date and time.");
      return;
    }

    setStatus("sending");
    try {
      const subjectValue = isVisitRequest ? VISIT_SUBJECT : trimmedSubject;
      const messageValue = isVisitRequest
        ? `Subject: ${VISIT_SUBJECT}\n\n${trimmedMessage}`
        : trimmedMessage;

      const body = isVisitRequest
        ? new URLSearchParams({
            [VISIT_ENTRIES.fullName]: trimmedName,
            [VISIT_ENTRIES.email]: trimmedEmail,
            [VISIT_ENTRIES.preferredDate]: trimmedDate,
            [VISIT_ENTRIES.preferredTime]: trimmedTime,
            [VISIT_ENTRIES.message]: messageValue,
          })
        : new URLSearchParams({
            [ENTRIES.fullName]: trimmedName,
            [ENTRIES.email]: trimmedEmail,
            [ENTRIES.subject]: subjectValue,
            [ENTRIES.message]: messageValue,
          });

      const actionUrl = isVisitRequest ? VISIT_FORM_ACTION : FORM_ACTION;

      await fetch(actionUrl, {
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
      setPreferredDate("");
      setPreferredTime("");
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
      {isVisitRequest && (
        <Alert severity="info" sx={{ mb: 2, wordBreak: "break-word" }}>
          You're scheduling a visit. Please provide your preferred date and
          time.
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
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          sx={fieldSx}
        />
        <TextField
          fullWidth
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={fieldSx}
        />
      </Box>
      <TextField
        fullWidth
        label="Subject"
        placeholder="Enter a subject"
        value={isVisitRequest ? VISIT_SUBJECT : subject}
        onChange={(e) => setSubject(e.target.value)}
        slotProps={{ input: { readOnly: isVisitRequest } }}
        sx={{ ...fieldSx, mb: 2 }}
      />
      {isVisitRequest && (
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
            required
            type="date"
            label="Preferred Date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />
          <TextField
            fullWidth
            required
            type="time"
            label="Preferred Time"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={fieldSx}
          />
        </Box>
      )}
      <TextField
        fullWidth
        multiline
        minRows={5}
        label="Message"
        placeholder="Enter your message"
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
