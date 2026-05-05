import { useState } from "react";
import { Box, Container } from "@mui/material";
import { AdmissionHero } from "./AdmissionHero";
import { AdmissionBottomBanner } from "./components/AdmissionBottomBanner";
import { AdmissionFormCard, type AdmissionFormFieldChangeEvent, type AdmissionFormState } from "./components/AdmissionFormCard";
import { AdmissionSidebarCards } from "./components/AdmissionSidebarCards";

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSd2JtJhrLXFCwNAmihpq3a5IfVoKFAtCKpPKDaiHMHWlgWbNA/formResponse";

export default function Admission() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<AdmissionFormState>({
    studentName: "",
    grade: "",
    parentName: "",
    contact: "",
    email: "",
  });

  const onChange =
    (key: keyof typeof form) =>
    (e: AdmissionFormFieldChangeEvent) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const body = new URLSearchParams({
        "entry.1908897666": form.studentName,
        "entry.197726392": form.grade,
        "entry.1292244211": form.parentName,
        "entry.1690227918": form.contact,
        "entry.777913737": form.email,
      });
      await fetch(FORM_URL, { method: "POST", mode: "no-cors", body });
      setMessage("Application submitted successfully.");
      setForm({ studentName: "", grade: "", parentName: "", contact: "", email: "" });
    } catch {
      setMessage("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#F5F7FB" }}>
      <AdmissionHero />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2.5, md: 3.5 }, alignItems: "stretch" }}>
          <Box sx={{ width: { xs: "100%", md: "calc(58.333% - 14px)" } }}>
            <AdmissionFormCard form={form} submitting={submitting} message={message} onChange={onChange} onSubmit={submit} />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "calc(41.666% - 14px)" } }}>
            <AdmissionSidebarCards />
          </Box>
        </Box>
        <AdmissionBottomBanner />
      </Container>
    </Box>
  );
}
