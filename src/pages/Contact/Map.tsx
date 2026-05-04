import { Box } from "@mui/material";
import { siteContact } from "../../constants/siteContact";

type ContactMapProps = {
  embedUrl?: string;
};

export default function ContactMap({
  embedUrl = siteContact.mapEmbedUrl,
}: ContactMapProps) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          borderRadius: { xs: 2, sm: 3 },
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          aspectRatio: { xs: "16/7", sm: "16/5", md: "16/4.5" },
        }}
      >
        <Box
          component="iframe"
          title="Fairyland International School — map"
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sx={{
            border: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </Box>
    </Box>
  );
}
