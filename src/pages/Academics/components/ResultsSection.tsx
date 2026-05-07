import { Box, Container } from "@mui/material";
import { StatGrid } from "../../../components/ui/StatGrid";

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

        <StatGrid items={resultItems} sx={{ py: 0 }} />
      </Container>
    </Box>
  );
}
