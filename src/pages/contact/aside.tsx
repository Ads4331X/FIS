import { Box, Divider, IconButton, Typography } from "@mui/material";
import type { ReactNode } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PublicIcon from "@mui/icons-material/Public";
import HubIcon from "@mui/icons-material/Hub";
import GroupsIcon from "@mui/icons-material/Groups";

const navy = "#002D5B";
const iconChipBg = "rgba(255, 255, 255, 0.14)";

function Row({
  icon,
  kicker,
  children,
}: {
  icon: ReactNode;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
      <Box
        sx={{
          flexShrink: 0,
          width: 42,
          height: 42,
          borderRadius: 1,
          bgcolor: iconChipBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ color: "rgba(255,255,255,0.7)", mb: 0.25 }}
        >
          {kicker}
        </Typography>
        <Typography
          sx={{ color: "white", fontSize: "0.95rem", lineHeight: 1.55 }}
        >
          {children}
        </Typography>
      </Box>
    </Box>
  );
}

export default function Aside() {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: navy,
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          boxShadow: "0 8px 28px rgba(0,45,91,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: 2.75,
        }}
      >
        <Typography sx={{ color: "white", fontWeight: 700, fontSize: "1.2rem" }}>
          Contact Information
        </Typography>
        <Row icon={<LocationOnIcon fontSize="small" />} kicker="Our Location">
          Budhanilkantha-10, Baluwakhani, Kathmandu, Nepal
        </Row>
        <Row icon={<PhoneIcon fontSize="small" />} kicker="Phone Numbers">
          01-4164344
          <br />
          01-4164023
        </Row>
        <Row icon={<EmailIcon fontSize="small" />} kicker="Email Address">
          info@fairyland.edu.np
        </Row>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.18)" }} />

        <Typography sx={{ color: "white", fontWeight: 600 }}>
          Follow Us
        </Typography>
        <Box sx={{ display: "flex", gap: 1.25 }}>
          {(
            [
              { Icon: PublicIcon, label: "Official website" },
              { Icon: HubIcon, label: "Networks" },
              { Icon: GroupsIcon, label: "Community" },
            ] as const
          ).map(({ Icon, label }) => (
            <IconButton
              key={label}
              size="small"
              aria-label={label}
              sx={{
                color: "white",
                bgcolor: iconChipBg,
                "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
              }}
            >
              <Icon fontSize="small" />
            </IconButton>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
