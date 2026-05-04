import { Box } from "@mui/material";
import { siteContact } from "../../constants/siteContact";

type ContactMapProps = {
  embedUrl?: string;
};

/** Full-width embed; default URL matches Footer map search (Fairyland International School). */
export default function ContactMap({ embedUrl = siteContact.mapEmbedUrl }: ContactMapProps) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          borderRadius: { xs: 2, sm: 3 },
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          "&::before": {
            content: '""',
            display: "block",
            pt: { xs: "36%", sm: "28.125%", md: "26%" },
          },
        }}
      >
        <Box
          component="iframe"
          title="Fairyland International School — map"
          src={embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sx={{
            position: "absolute",
            inset: 0,
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
