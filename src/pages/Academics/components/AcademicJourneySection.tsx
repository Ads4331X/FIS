import { useEffect, useRef, useState } from "react";
import { Box, Container, Grid } from "@mui/material";
import { ProgramCard } from "../../../components/ui/ProgramCard";

type StatItem = { label: string; value: number; suffix?: string };

const secondaryStats: StatItem[] = [
  { label: "Pass Rate", value: 100, suffix: "%" },
  { label: "Students", value: 115, suffix: "+" },
  { label: "Clubs", value: 20, suffix: "+" },
];

function StatsStrip({
  stats,
  active,
  animated,
}: {
  stats: StatItem[];
  active: boolean;
  animated: number[];
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
        mt: 1.25,
      }}
    >
      {stats.map((s, i) => (
        <Box
          key={s.label}
          sx={{
            borderRadius: 2,
            backgroundColor: "white",
            px: 1.5,
            py: 1.2,
            textAlign: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          <Box sx={{ color: "#0b2f57", fontWeight: 800, fontSize: "1rem" }}>
            {active ? animated[i] : s.value}
            {s.suffix ?? ""}
          </Box>
          <Box
            sx={{
              color: "#64748b",
              fontSize: "0.68rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            {s.label}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export function AcademicJourneySection({ sectionId }: { sectionId?: string }) {
  const secondaryCardRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [animated, setAnimated] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    if (!secondaryCardRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(secondaryCardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const targets = secondaryStats.map((s) => s.value);
    const duration = 1300;
    const start = performance.now();
    let frameId = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setAnimated(targets.map((t) => Math.round(t * eased)));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active]);

  const cards = [
    {
      badge: "FOUNDATION",
      badgeSx: { backgroundColor: "#E3F2FD", color: "#074783" },
      title: "Nursery",
      description:
        "Play-based early learning that builds confidence, curiosity, and social skills.",
      sx: { color: "#454748", backgroundColor: "#fff" },
      gridSize: { xs: 12, md: 4 },
    },
    {
      badge: "PRIMARY",
      badgeSx: { backgroundColor: "#E8F5E9", color: "#2E7D32" },
      title: "Primary Education",
      description:
        "Strong fundamentals in language, mathematics, and science with interactive learning.",
      sx: { backgroundColor: "#00315E", color: "#7FADF0" },
      titleSx: { color: "#fff" },
      gridSize: { xs: 12, md: 8 },
      img: "/images/primary.jpg",
    },
    {
      badge: "SECONDARY",
      badgeSx: { backgroundColor: "#FFF3E0", color: "#EF6C00" },
      title: "Secondary Level",
      description:
        "Focused academics, project-based work, and regular evaluation for board readiness.",
      sx: { backgroundColor: "#e8edf0", color: "#454748" },
      titleSx: { color: "#074783" },
      gridSize: { xs: 12, md: 12 },
      img: "/images/secondary.jpg",
      imgWidth: "42%",
      cardRef: secondaryCardRef,
      extra: (
        <StatsStrip stats={secondaryStats} active={active} animated={animated} />
      ),
    },
  ];

  return (
    <Container id={sectionId} sx={{ py: { xs: 5, md: 8 } }}>
      <Box
        component="h2"
        sx={{
          color: "#074783",
          textAlign: "center",
          fontSize: { xs: "1.8rem", md: "2.3rem" },
          fontWeight: 800,
          mb: 1,
        }}
      >
        Academic Journey
      </Box>
      <Box
        component="p"
        sx={{
          color: "#6b7280",
          textAlign: "center",
          maxWidth: 700,
          mx: "auto",
          mb: 4,
          fontSize: { xs: "0.95rem", md: "1.05rem" },
        }}
      >
        Program pathways designed to nurture each student from early learning to
        confident secondary achievement.
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {cards.map((c) => (
          <Grid key={c.title} size={c.gridSize}>
            <ProgramCard {...c} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
