import { Box, Skeleton } from "@mui/material";

export function HeadStaffSkeleton() {
  return (
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
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Box key={i} sx={{ minWidth: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid #e8eef6",
              borderLeft: "4px solid #c8daf5",
              height: 110,
            }}
          >
            <Skeleton
              variant="rectangular"
              sx={{ width: 110, flexShrink: 0, bgcolor: "#e8eef6" }}
            />
            <Box
              sx={{
                flex: 1,
                px: 2,
                py: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <Skeleton width="50%" height={10} sx={{ bgcolor: "#e8eef6" }} />
              <Skeleton width="75%" height={16} sx={{ bgcolor: "#e8eef6" }} />
              <Skeleton width="90%" height={10} sx={{ bgcolor: "#e8eef6" }} />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
