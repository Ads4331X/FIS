import { Alert, Box } from "@mui/material";

export function HeadStaffEmptyState() {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", px: { xs: 1, sm: 0 } }}>
      <Alert
        severity="info"
        sx={{
          borderRadius: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        No head staff records are available right now. Use the admin dashboard
        to add the team members shown on the homepage.
      </Alert>
    </Box>
  );
}
