import { Box, Container, Alert } from "@mui/material";
import { HeadStaffCarousel } from "./HeadStaffCarousel";
import { HeadStaffEmptyState } from "./HeadStaffEmptyState";
import { HeadStaffHeader } from "./HeadStaffHeader";
import { HeadStaffSkeleton } from "./HeadStaffSkeleton";
import { useHeadStaff } from "../hooks/useHeadStaff";

export default function HeadStaffSection() {
  const { staff, loading, error } = useHeadStaff();

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <HeadStaffHeader />

      <Box sx={{ mt: 4 }}>
        {loading ? (
          <HeadStaffSkeleton />
        ) : error ? (
          <Alert severity="error" sx={{ maxWidth: 720, mx: "auto" }}>
            {error}
          </Alert>
        ) : staff.length === 0 ? (
          <HeadStaffEmptyState />
        ) : (
          <HeadStaffCarousel staff={staff.slice(0, 6)} />
        )}
      </Box>
    </Container>
  );
}
