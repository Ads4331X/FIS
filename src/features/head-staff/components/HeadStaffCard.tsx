import { Box, Card, CardContent, Typography } from "@mui/material";
import type { HeadStaffMember } from "../types/headStaff.types";
import { HEAD_STAFF_FALLBACK_IMAGE } from "../utils/headStaff.utils";

type Props = {
  member: HeadStaffMember;
};

export function HeadStaffCard({ member }: Props) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        width: "100%",
        height: "100%",
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <Box
        sx={{
          aspectRatio: "4 / 5",
          overflow: "hidden",
          bgcolor: "grey.100",
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
            transition: "transform 0.4s ease",
            ".swiper-slide:hover &": {
              transform: "scale(1.04)",
            },
          }}
        />
      </Box>

      <CardContent sx={{ p: { xs: 2, md: 2.5 }, textAlign: "center" }}>
        <Typography
          variant="overline"
          sx={{
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            fontWeight: 600,
            color: "primary.main",
            display: "block",
            mb: 0.5,
          }}
        >
          {member.position}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: "1rem", md: "1.1rem" },
            fontWeight: 700,
            mb: 0.75,
            color: "text.primary",
          }}
        >
          {member.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.6,
            fontSize: { xs: "0.8rem", md: "0.85rem" },
          }}
        >
          {member.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
