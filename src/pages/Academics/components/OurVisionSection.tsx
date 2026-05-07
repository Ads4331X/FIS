import { Box, Container } from "@mui/material";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

const pillars = [
  {
    title: "Unwavering Integrity",
    description:
      "Character-first education that nurtures responsibility, empathy, and ethical decision making.",
    icon: <VerifiedOutlinedIcon fontSize="large" />,
  },
  {
    title: "Academic Excellence",
    description:
      "A disciplined learning environment where students are encouraged to think deeply and perform confidently.",
    icon: <AutoAwesomeOutlinedIcon fontSize="large"  />,
  },
];

export function OurVisionSection({ sectionId }: { sectionId?: string }) {
  return (
    <Box id={sectionId} component="section" sx={{ py: { xs: 6, md: 9 }, bgcolor: "#fff" }}>
      <Container
        maxWidth="lg"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
          gap: { xs: 3, md: 6 },
          alignItems: "center",
        }}
      >
        <Box>
          <Box
            component="h2"
            sx={{ m: 0, color: "#0b2f57", fontSize: { xs: "1.7rem", md: "2.1rem" }, mb: 2 }}
          >
            Our Core Pillars
          </Box>

          <Box sx={{ display: "grid", gap: 2.25 }}>
            {pillars.map((pillar) => (
              <Box
                key={pillar.title}
                sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
              >
                <Box sx={{ mt: 0.1, color: "#0b2f57", flexShrink: 0 }}>{pillar.icon}</Box>
                <Box>
                  <Box component="h3" sx={{ m: 0, color: "#0f172a", fontSize: "1.05rem", mb: 0.4 }}>
                    {pillar.title}
                  </Box>
                  <Box component="p" sx={{ m: 0, color: "#64748b", lineHeight: 1.7 }}>
                    {pillar.description}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            mx: "auto",
            width: "100%",
            maxWidth: 420,
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 18px 40px rgba(2, 33, 71, 0.2)",
            border: "10px solid #f8fafc",
            transform: { md: "rotate(2deg)" },
          }}
        >
          <Box
            component="img"
            src="/images/academics.jpg"
            alt="Our vision"
            sx={{ width: "100%", height: 330, objectFit: "cover", objectPosition: "center" }}
          />
        </Box>
      </Container>
    </Box>
  );
}
