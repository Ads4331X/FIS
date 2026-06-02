import { Box, Card, Skeleton } from "@mui/material";

export function HeadStaffSkeleton() {
  return (
    <Box
      sx={{
        display: "grid",
        gap: { xs: 2, md: 3 },
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
      }}
    >
      {[1, 2, 3].map((index) => (
        <Card
          key={index}
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Skeleton
            variant="rectangular"
            sx={{
              height: { xs: 240, sm: 280, md: 300 },
              bgcolor: "grey.100",
            }}
          />
          <Box sx={{ p: { xs: 2, md: 2.5 }, textAlign: "center" }}>
            <Skeleton
              width="35%"
              height={14}
              sx={{ mx: "auto", mb: 1, bgcolor: "grey.200" }}
            />
            <Skeleton
              width="55%"
              height={22}
              sx={{ mx: "auto", mb: 1.25, bgcolor: "grey.200" }}
            />
            <Skeleton
              width="85%"
              height={14}
              sx={{ mx: "auto", mb: 0.5, bgcolor: "grey.200" }}
            />
            <Skeleton
              width="65%"
              height={14}
              sx={{ mx: "auto", bgcolor: "grey.200" }}
            />
          </Box>
        </Card>
      ))}
    </Box>
  );
}
