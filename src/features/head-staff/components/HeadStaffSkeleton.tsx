import { Box, Card, Skeleton } from "@mui/material";

export function HeadStaffSkeleton() {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 3,
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
      }}
    >
      {[1, 2].map((index) => (
        <Card key={index} sx={{ p: 2, minHeight: 320 }}>
          <Skeleton
            variant="rectangular"
            height={220}
            sx={{ borderRadius: 3 }}
          />
          <Skeleton width="60%" sx={{ mt: 2 }} />
          <Skeleton width="40%" sx={{ mt: 1 }} />
          <Skeleton width="100%" sx={{ mt: 1 }} />
        </Card>
      ))}
    </Box>
  );
}
