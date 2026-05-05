import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { siteContact } from "../../../constants/siteContact";

const admissionSteps = [
  ["Submit Inquiry", "Complete the form to confirm interest."],
  ["School Visit", "Our admissions team will contact you."],
  ["Assessment", "A brief evaluation follows by enrolment."],
] as const;

const requiredDocuments = ["Birth Certificate", "Previous Report Cards", "Passport Size Photos"] as const;

export function AdmissionSidebarCards() {
  return (
    <Stack spacing={2.25}>
      <Card sx={{ borderRadius: 3.5, bgcolor: "#0B4A93", color: "white" }}>
        <CardContent sx={{ p: 2.75 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.25 }}>
            Admissions Process
          </Typography>
          {admissionSteps.map(([title, desc], i) => (
            <Box key={title} sx={{ display: "flex", gap: 1.5, mb: i === 2 ? 0 : 1.75 }}>
              <Box sx={{ minWidth: 25, height: 25, borderRadius: "50%", bgcolor: "rgba(172,209,255,.28)", fontSize: 12, fontWeight: 700, display: "grid", placeItems: "center" }}>{i + 1}</Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{title}</Typography>
                <Typography sx={{ opacity: 0.88, fontSize: 13, lineHeight: 1.35 }}>{desc}</Typography>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3.5 }}>
        <CardContent sx={{ p: 2.75 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1F4D84", mb: 1.5 }}>
            Required Documents
          </Typography>
          {requiredDocuments.map((doc) => (
            <Box key={doc} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.75, px: 1.25, borderRadius: 1.6, bgcolor: "#F6F7F9", mb: 1 }}>
              <DescriptionOutlinedIcon sx={{ fontSize: 17, color: "#3C6EA7" }} />
              <Typography sx={{ color: "#4E596B", fontSize: 14 }}>{doc}</Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3.5 }}>
        <CardContent sx={{ p: 2.75, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1.5 }}>
          <Box>
            <Typography sx={{ color: "#3A5C83", fontSize: 22, fontWeight: 700, lineHeight: 1.1, mb: 0.75 }}>Need Help?</Typography>
            <Typography sx={{ color: "#6D7787", fontSize: 13, mb: 0.6 }}>Our desk is open 8AM - 4PM</Typography>
            <Typography component="a" href={`tel:${siteContact.phoneTel}`} sx={{ fontWeight: 800, color: "#154777", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
              {siteContact.phoneDisplay}
            </Typography>
          </Box>
          <Box sx={{ width: 38, height: 38, borderRadius: "50%", bgcolor: "#FFE9EC", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <PhoneOutlinedIcon sx={{ color: "#D73A4A", fontSize: 18 }} />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
