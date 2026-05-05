import { useEffect, useRef, useState } from "react";
import { Box, Container, Grid } from "@mui/material";

type StatItem = {
  label: string;
  value: number;
  suffix?: string;
};

const secondaryStats: StatItem[] = [
  { label: "Pass Rate", value: 100, suffix: "%" },
  { label: "Students", value: 115 , suffix: "+" },
  { label: "Clubs", value: 20, suffix: "+" },
];

export function AcademicJourneySection({ sectionId }: { sectionId?: string }) {
  const secondaryCardRef = useRef<HTMLDivElement | null>(null);
  const [counterActive, setCounterActive] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    if (!secondaryCardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setCounterActive(true);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(secondaryCardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!counterActive) return;

    const targets = secondaryStats.map((item) => item.value);
    const duration = 1300;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setAnimatedStats(targets.map((target) => Math.round(target * eased)));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [counterActive]);

  const cards = [
    {
      badge: "FOUNDATION",
      badgesx: { backgroundColor: "#E3F2FD", color: "#074783" },
      title: "Nursery",
      description:
        "Play-based early learning that builds confidence, curiosity, and social skills.",
      sx: { color: "#454748", backgroundColor: "#fff" },
      gridSize: { xs: 12, md: 4 },
    },
    {
      badge: "PRIMARY",
      badgesx: { backgroundColor: "#E8F5E9", color: "#2E7D32" },
      title: "Primary Education",
      description:
        "Strong fundamentals in language, mathematics, and science with interactive learning.",
      sx: { backgroundColor: "#00315E", color: "#7FADF0" },
      titlesx: { color: "#fff" },
      gridSize: { xs: 12, md: 8 },
      img: "/images/primary.jpg",
    },
    {
      badge: "SECONDARY",
      badgesx: { backgroundColor: "#FFF3E0", color: "#EF6C00" },
      title: "Secondary Level",
      description:
        "Focused academics, project-based work, and regular evaluation for board readiness.",
      sx: { backgroundColor: "#e8edf0", color: "#454748" },
      titlesx: { color: "#074783" },
      gridSize: { xs: 12, md: 12 },
      img: "/images/secondary.jpg",
      stats: secondaryStats,
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
        {cards.map((item) => (
          <Grid key={item.title} size={item.gridSize}>
            <Box
              ref={item.badge === "SECONDARY" ? secondaryCardRef : null}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                p: { xs: 2, md: 2.5 },
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: item.img ? "row" : "column" },
                height: "100%",
                transition: "all 0.3s ease",
                ...(item.sx || {}),
              }}
            >
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: "fit-content",
                    px: 2,
                    py: 0.5,
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    ...(item.badgesx || {}),
                  }}
                >
                  {item.badge}
                </Box>

                <Box
                  component="h3"
                  sx={{
                    mb: 0.5,
                    fontSize: { xs: "1.2rem", md: "1.4rem" },
                    fontWeight: 700,
                    ...item.titlesx,
                  }}
                >
                  {item.title}
                </Box>

                <Box
                  component="p"
                  sx={{ m: 0, lineHeight: 1.6, fontSize: { xs: "0.92rem", md: "1rem" } }}
                >
                  {item.description}
                </Box>

                {item.stats ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 1,
                      mt: 1.25,
                    }}
                  >
                    {item.stats.map((stat, index) => (
                      <Box
                        key={stat.label}
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
                          {counterActive ? animatedStats[index] : stat.value}
                          {stat.suffix ?? ""}
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
                          {stat.label}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : null}
              </Box>

              {item.img ? (
                <Box
                  component="img"
                  src={item.img}
                  alt={item.title}
                  sx={{
                    width: { xs: "100%", sm: item.badge === "SECONDARY" ? "42%" : "35%" },
                    maxHeight: 170,
                    objectFit: "cover",
                    borderRadius: 2.5,
                    flexShrink: 0,
                  }}
                />
              ) : null}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
