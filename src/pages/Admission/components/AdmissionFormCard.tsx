import type { ChangeEvent, FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";

export type AdmissionFormState = {
  studentName: string;
  grade: string;
  parentName: string;
  contact: string;
  email: string;
};

export type AdmissionFormFieldChangeEvent =
  | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent;

type Props = {
  form: AdmissionFormState;
  submitting: boolean;
  message: string;
  onChange: (
    key: keyof AdmissionFormState,
  ) => (e: AdmissionFormFieldChangeEvent) => void;
  onSubmit: (e: FormEvent) => Promise<void>;
};

const grades = [
  "Nursery",
  "LKG",
  "UKG",
  ...Array.from({ length: 10 }, (_, i) => `${i + 1}`),
];
const inputSx = {
  "& .MuiInputBase-root": { bgcolor: "#F1F3F5", borderRadius: 1.5 },
};
const labelSx = { fontSize: 14, color: "#525D70", mb: 0.7 };

export function AdmissionFormCard({
  form,
  submitting,
  message,
  onChange,
  onSubmit,
}: Props) {
  return (
    <Card sx={{ borderRadius: 3.5, boxShadow: "0 1px 0 rgba(0,0,0,.03)" }}>
      <CardContent sx={{ p: { xs: 2.75, md: 3.25 } }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "#1E3D6B", mb: 1 }}
        >
          Student Application
        </Typography>
        <Typography sx={{ mb: 3, color: "#6E7787", fontSize: 14 }}>
          Please provide the following details to begin the enrollment process.
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Typography sx={labelSx}>Full Name</Typography>
              <TextField
                fullWidth
                required
                size="small"
                placeholder="Enter your full name"
                value={form.studentName}
                onChange={onChange("studentName")}
                sx={inputSx}
                autoComplete="name"
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Typography sx={labelSx}>Grade</Typography>
              <FormControl fullWidth size="small" required>
                <InputLabel>Grade</InputLabel>
                <Select
                  label="Grade"
                  value={form.grade}
                  onChange={onChange("grade")}
                  sx={inputSx}
                >
                  {grades.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: "100%" }}>
              <Typography sx={labelSx}>Parent / Guardian Name</Typography>
              <TextField
                fullWidth
                required
                size="small"
                placeholder="Enter parent or guardian name"
                value={form.parentName}
                onChange={onChange("parentName")}
                sx={inputSx}
                autoComplete="name"
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Typography sx={labelSx}>Contact Number</Typography>
              <TextField
                fullWidth
                required
                type="tel"
                size="small"
                placeholder="Enter contact number"
                value={form.contact}
                onChange={onChange("contact")}
                sx={inputSx}
                autoComplete="tel"
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Typography sx={labelSx}>Email Address</Typography>
              <TextField
                fullWidth
                required
                size="small"
                type="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={onChange("email")}
                sx={inputSx}
                autoComplete="email"
              />
            </Box>

            <Box sx={{ width: "100%", mt: 1 }}>
              <Button
                type="submit"
                disabled={submitting}
                fullWidth
                variant="contained"
                endIcon={<ArrowRightAltOutlinedIcon />}
                sx={{
                  py: 1.15,
                  borderRadius: 1.75,
                  bgcolor: "#D5001F",
                  "&:hover": { bgcolor: "#BC001B" },
                }}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </Box>
          </Box>
        </Box>

        {message ? (
          <Alert
            severity={message.includes("success") ? "success" : "error"}
            sx={{ mt: 2.5 }}
          >
            {message}
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}
