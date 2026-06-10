import { Box, Typography } from "@mui/material";
import type { HeadStaffMember } from "../types/headStaff.types";
import PersonOutlineIcon from "@mui/icons-material/Person2Outlined";

type Props = {
  member: HeadStaffMember;
};

export function HeadStaffCard({ member }: Props) {
  const hasImage = Boolean(member.imageUrl);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        borderRadius: "12px",
        overflow: "hidden",
        bgcolor: "#ffffff",
        border: "1px solid #e8eef6",
        boxShadow: "0 1px 6px rgba(20,40,90,0.06)",
        // Signature: blue left accent bar
        borderLeft: "4px solid #2878eb",
        transition: "box-shadow 0.22s ease",
        height: "100%",
        "&:hover": {
          boxShadow: "0 6px 24px rgba(20,40,90,0.11)",
        },
      }}
    >
      {/* Photo — fixed square, sits flush left */}
      <Box
        sx={{
          width: { xs: 96, sm: 110 },
          flexShrink: 0,
          bgcolor: "#dde3ef",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {hasImage ? (
          <Box
            component="img"
            src={member.imageUrl}
            alt={member.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              const fb = e.currentTarget.nextSibling as HTMLElement | null;
              if (fb) fb.style.removeProperty("display");
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        ) : null}

        {/* Placeholder icon */}
        <Box
          sx={{
            display: hasImage ? "none" : "flex",
            position: "absolute",
            inset: 0,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            bgcolor: "#dde3ef",
            gap: 0.5,
          }}
        >
          <PersonOutlineIcon sx={{ fontSize: 36, color: "#9db3d0" }} />
        </Box>
      </Box>

      {/* Info — sits right of photo, vertically centered */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.5, sm: 2 },
          minWidth: 0, // prevents text overflow
        }}
      >
        {/* Position label — small uppercase badge */}
        <Typography
          sx={{
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#2878eb",
            mb: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member.position}
        </Typography>

        {/* Name */}
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: "0.9rem", sm: "0.95rem" },
            color: "#1a2b4a",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {member.name}
        </Typography>

        {/* Divider line */}
        <Box
          sx={{
            mt: 1.25,
            width: 28,
            height: 2,
            borderRadius: 1,
            bgcolor: "#e0eaf8",
          }}
        />

        {/* Description — only if present */}
        {member.description && (
          <Typography
            sx={{
              mt: 1,
              fontSize: "0.75rem",
              color: "#6b7f99",
              lineHeight: 1.55,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {member.description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
