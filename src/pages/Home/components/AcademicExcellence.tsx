import { Container, Box, Grid, Button } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { ProgramCard } from "../../../components/ui/ProgramCard";

const cards = [
  {
    badge: "FOUNDATION",
    badgeSx: { backgroundColor: "#E3F2FD", color: "#074783" },
    title: "Nursery & Pre-School",
    description:
      "Montessori-inspired Nursery and Pre-School with sensory discovery, practical life routines, and early social learning.",
    sx: { color: "#454748" },
    gridSize: { xs: 12, sm: 12, md: 4 },
  },
  {
    badge: "PRIMARY",
    badgeSx: { backgroundColor: "#E8F5E9", color: "#2E7D32" },
    title: "Classes 1 to 5",
    description:
      "Thematic, interactive learning for Classes 1–5 that strengthens literacy, numeracy, science, and creative thinking.",
    sx: { backgroundColor: "#00315E", color: "#7FADF0" },
    titleSx: { color: "#fff" },
    gridSize: { xs: 12, sm: 12, md: 8 },
    img: "/images/primary.jpg",
  },
  {
    badge: "SECONDARY",
    badgeSx: { backgroundColor: "#FFF3E0", color: "#EF6C00" },
    title: "Classes 6 to 10",
    description:
      "Structured support for Classes 6–10 with inquiry-based lessons and a balanced co-curricular approach to help students thrive.",
    sx: { backgroundColor: "#e8edf0", color: "#454748" },
    titleSx: { color: "#074783" },
    gridSize: { xs: 12, sm: 12, md: 8 },
    img: "/images/secondary.jpg",
  },
  {
    title: "Board Prep Program",
    description:
      "Balanced academic support and enrichment rooted in thoughtful practice, character development, and co-curricular engagement.",
    sx: { color: "white", backgroundColor: "red", fontSize: "0.7rem" },
    gridSize: { xs: 12, sm: 12, md: 4 },
    extra: (
      <Button
        href="/academics"
        sx={{
          mt: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          fontWeight: "bold",
          color: "inherit",
          "&:hover span": { transform: "translateX(4px)" },
        }}
      >
        Learn about our results
        <Box
          component="span"
          sx={{ display: "flex", transition: "transform 0.3s ease" }}
        >
          <TrendingUpIcon sx={{ fontSize: "1.2rem", ml: 0.5 }} />
        </Box>
      </Button>
    ),
  },
];

export default function AcademicExcellence() {
  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <Box
        component="h1"
        sx={{
          color: "#074783",
          textAlign: "center",
          fontSize: { xs: "1.8rem", md: "2.4rem" },
          fontWeight: "bold",
        }}
      >
        Academic Excellence
      </Box>
      <Box
        component="p"
        sx={{
          color: "#555",
          textAlign: "center",
          mt: 2,
          maxWidth: 700,
          mx: "auto",
          fontSize: { xs: "1rem", md: "1.1rem" },
        }}
      >
        From early childhood development to advanced secondary education, we
        provide a structured curriculum designed for success.
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 4 }}>
        {cards.map((c) => (
          <Grid key={c.title} size={c.gridSize}>
            <ProgramCard {...c} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
