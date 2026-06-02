import { Box, Container, Alert } from "@mui/material";
import { HeadStaffCarousel } from "./HeadStaffCarousel";
import { HeadStaffEmptyState } from "./HeadStaffEmptyState";
import { HeadStaffHeader } from "./HeadStaffHeader";
import { HeadStaffSkeleton } from "./HeadStaffSkeleton";
import { useHeadStaff } from "../hooks/useHeadStaff";

export default function HeadStaffSection() {
  const { staff, loading, error } = useHeadStaff();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 5, sm: 7, md: 10 },
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <HeadStaffHeader />

        <Box sx={{ mt: { xs: 3, md: 5 } }}>
          {loading ? (
            <HeadStaffSkeleton />
          ) : error ? (
            <Alert
              severity="error"
              sx={{
                maxWidth: 600,
                mx: "auto",
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          ) : staff.length === 0 ? (
            <HeadStaffEmptyState />
          ) : (
            <HeadStaffCarousel staff={staff.slice(0, 6)} />
          )}
        </Box>
      </Container>
    </Box>
  );
}
