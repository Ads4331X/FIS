import { Box, Card, CardContent, Typography } from "@mui/material";
import type { HeadStaffMember } from "../types/headStaff.types";
import { HEAD_STAFF_FALLBACK_IMAGE } from "../utils/headStaff.utils";

type Props = {
  member: HeadStaffMember;
};

export function HeadStaffCard({ member }: Props) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        width: "100%",
        height: "100%",

        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        transition: "0.3s ease",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.15)",
        },
      }}
    >
      {/* image */}
      <Box
        sx={{
          aspectRatio: "1 / 1",
          overflow: "hidden",
          bgcolor: "#E2E8F0",
        }}
      >
        <Box
          component="img"
          src={member.imageUrl || HEAD_STAFF_FALLBACK_IMAGE}
          alt={member.name}
          onError={(e) => {
            e.currentTarget.src = HEAD_STAFF_FALLBACK_IMAGE;
          }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "0.4s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.5, textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            fontWeight: 700,
            color: "primary.main",
            textTransform: "uppercase",
            mb: 0.5,
          }}
        >
          {member.position}
        </Typography>

        <Typography
          sx={{
            fontSize: "1.15rem",
            fontWeight: 800,
            mb: 1,
          }}
        >
          {member.name}
        </Typography>

        <Typography
          sx={{
            fontSize: "0.9rem",
            color: "text.secondary",
            lineHeight: 1.6,
          }}
        >
          {member.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
