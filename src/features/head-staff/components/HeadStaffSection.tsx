import { Alert, Box } from "@mui/material";
import { HeadStaffCard } from "./HeadStaffCard";
import { HeadStaffEmptyState } from "./HeadStaffEmptyState";
import { HeadStaffHeader } from "./HeadStaffHeader";
import { HeadStaffSkeleton } from "./HeadStaffSkeleton";
import { useHeadStaff } from "../hooks/useHeadStaff";

// Rendered inside <Container> in Home.tsx — no extra wrapper needed
export default function HeadStaffSection() {
  const { staff, loading, error } = useHeadStaff();

  const dedupedStaff = staff
    .filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i)
    .slice(0, 6);

  return (
    <Box component="section" sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
      <HeadStaffHeader />

      <Box sx={{ mt: { xs: 4, md: 6 } }}>
        {loading ? (
          <HeadStaffSkeleton />
        ) : error ? (
          <Alert
            severity="error"
            sx={{ borderRadius: 2, maxWidth: 600, mx: "auto" }}
          >
            {error}
          </Alert>
        ) : dedupedStaff.length === 0 ? (
          <HeadStaffEmptyState />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, minmax(0, 1fr))",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 2, sm: 3 },
            }}
          >
            {dedupedStaff.map((member, index) => (
              <Box key={`${member.id}-${index}`} sx={{ minWidth: 0 }}>
                <HeadStaffCard member={member} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
