import { Alert, Box } from "@mui/material";

export function HeadStaffEmptyState() {
  return (
    <Box sx={{ maxWidth: 720, mx: "auto" }}>
      <Alert severity="info">
        No head staff records are available right now. Use the admin dashboard
        to add the team members shown on the homepage.
      </Alert>
    </Box>
  );
}
