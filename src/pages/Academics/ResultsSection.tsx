import { Box, Container } from "@mui/material";

const resultItems = [
  { label: "SEE Pass Rate", value: "100%" },
  { label: "Distinction Holders", value: "35+" },
  { label: "Top GPA", value: "4.0" },
];

export function ResultsSection({ sectionId }: { sectionId?: string }) {
  return (
    <Box id={sectionId} component="section" sx={{ py: { xs: 6, md: 8 }, bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        <Box
          component="h2"
          sx={{
            textAlign: "center",
            color: "#0b2f57",
            fontSize: { xs: "1.7rem", md: "2.1rem" },
            fontWeight: 800,
            m: 0,
          }}
        >
          Results Highlights
        </Box>
        <Box
          component="p"
          sx={{
            textAlign: "center",
            color: "#64748b",
            maxWidth: 680,
            mx: "auto",
            mt: 1.5,
            mb: 3.5,
          }}
        >
          Consistent outcomes from disciplined teaching, guided practice, and focused board preparation.
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          {resultItems.map((item) => (
            <Box
              key={item.label}
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 3,
                p: { xs: 2.25, md: 2.75 },
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
              }}
            >
              <Box sx={{ color: "#0b2f57", fontSize: { xs: "1.6rem", md: "1.9rem" }, fontWeight: 800 }}>
                {item.value}
              </Box>
              <Box
                sx={{
                  color: "#64748b",
                  mt: 0.75,
                  fontWeight: 600,
                  fontSize: { xs: "0.86rem", md: "0.92rem" },
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {item.label}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
