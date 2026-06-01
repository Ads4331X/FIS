import { Box, Card, CardContent, Typography } from "@mui/material";
import type { HeadStaffMember } from "../types/headStaff.types";
import { HEAD_STAFF_FALLBACK_IMAGE } from "../utils/headStaff.utils";

type HeadStaffCardProps = {
  member: HeadStaffMember;
};

export function HeadStaffCard({ member }: HeadStaffCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 18px 48px rgba(15, 23, 42, 0.1)",
      }}
    >
      <Box
        component="img"
        src={member.imageUrl || HEAD_STAFF_FALLBACK_IMAGE}
        alt={member.name}
        onError={(event) => {
          event.currentTarget.src = HEAD_STAFF_FALLBACK_IMAGE;
        }}
        sx={{ width: "100%", height: 320, objectFit: "cover" }}
      />
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ color: "#B91C1C", fontWeight: 700, mb: 1 }}>
          {member.position}
        </Typography>
        <Typography
          component="h3"
          sx={{ fontSize: "1.45rem", fontWeight: 700, mb: 1 }}
        >
          {member.name}
        </Typography>
        <Typography sx={{ color: "#475569", lineHeight: 1.8 }}>
          {member.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
