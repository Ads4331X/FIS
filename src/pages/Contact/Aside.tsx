import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, Divider, IconButton, Link, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { TikTokIcon } from "../../components/icons/TikTokIcon";
import { siteContact } from "../../constants/siteContact";

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
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
        minWidth: 0,
        width: "100%",
      }}
    >
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
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: "rgba(255,255,255,0.7)", mb: 0.25 }}
        >
          {kicker}
        </Typography>
        <Typography
          component="div"
          sx={{
            color: "white",
            fontSize: "0.95rem",
            lineHeight: 1.55,
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            "& a": { wordBreak: "break-word", overflowWrap: "anywhere" },
          }}
        >
          {children}
        </Typography>
      </Box>
    </Box>
  );
}

const SOCIAL_ICON_PX = 22;

const socialGlyphSx = {
  fontSize: SOCIAL_ICON_PX,
  width: SOCIAL_ICON_PX,
  height: SOCIAL_ICON_PX,
};

const socialIconSx = {
  color: "white",
  p: "6px",
  bgcolor: "transparent",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": { bgcolor: "transparent", color: "rgba(255,255,255,0.85)" },
  "& .MuiSvgIcon-root": socialGlyphSx,
  "& svg": socialGlyphSx,
} as const;

export default function Aside() {
  return (
    <Box sx={{ width: "100%", boxSizing: "border-box" }}>
      <Box
        sx={{
          bgcolor: navy,
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          boxShadow: "0 8px 28px rgba(0,45,91,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: 2.75,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography
          sx={{ color: "white", fontWeight: 700, fontSize: "1.2rem" }}
        >
          Contact Information
        </Typography>
        <Row icon={<LocationOnIcon fontSize="small" />} kicker="Our Location">
          <Link
            href={siteContact.mapOpenUrl}
            target="_blank"
            rel="noopener noreferrer"
            underline="always"
            sx={{ color: "inherit" }}
          >
            {siteContact.addressDisplay}
          </Link>
        </Row>
        <Row icon={<PhoneIcon fontSize="small" />} kicker="Phone">
          <Link href={`tel:${siteContact.phoneTel}`} sx={{ color: "inherit" }}>
            {siteContact.phoneDisplay}
          </Link>
        </Row>
        <Row icon={<EmailIcon fontSize="small" />} kicker="Email Address">
          <Link href={`mailto:${siteContact.email}`} sx={{ color: "inherit" }}>
            {siteContact.email}
          </Link>
        </Row>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.18)" }} />

        <Typography sx={{ color: "white", fontWeight: 600 }}>
          Follow Us
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1.25,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <IconButton
            component={Link}
            href={siteContact.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            size="small"
            sx={socialIconSx}
          >
            <FacebookIcon sx={socialGlyphSx} />
          </IconButton>
          <IconButton
            component={Link}
            href={siteContact.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            size="small"
            sx={socialIconSx}
          >
            <YouTubeIcon sx={socialGlyphSx} />
          </IconButton>
          <IconButton
            component={Link}
            href={siteContact.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            size="small"
            sx={socialIconSx}
          >
            <TikTokIcon size={SOCIAL_ICON_PX} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
