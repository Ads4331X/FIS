import { Container, Box, Grid, Button } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function AcademicExcellence() {
  const academicExcellenceData = [
    {
      badge: "FOUNDATION",
      badgesx: { backgroundColor: "#E3F2FD", color: "#074783" },
      title: "Nursery & Pre-School",
      description:
        "Fostering curiosity through play-based learning and social development in a safe, vibrant space.",
      sx: { color: "#454748" },
      gridSize: { xs: 12, sm: 12, md: 4 },
    },
    {
      badge: "PRIMARY",
      badgesx: { backgroundColor: "#E8F5E9", color: "#2E7D32" },
      title: "Classes 1 to 5",
      sx: { backgroundColor: "#00315E", color: "#7FADF0" },
      gridSize: { xs: 12, sm: 12, md: 8 },
      titlesx: { color: "#fff" },
      img: "/images/primary.jpg",
      description:
        "Building strong fundamentals in literacy, numeracy, and scientific inquiry through interactive learning tools and dedicated guidance.",
    },
    {
      badge: "SECONDARY",
      badgesx: { backgroundColor: "#FFF3E0", color: "#EF6C00" },
      title: "Classes 6 to 10",
      description:
        "Rigorous academic training and regular assessment cycles to ensure every student hits their peak potential.",
      gridSize: { xs: 12, sm: 12, md: 8 },
      img: "/images/secondary.jpg",
      sx: { backgroundColor: "#e8edf0", color: "#454748" },
      titlesx: { color: "#074783" },
    },
    {
      title: "Board Prep Program",
      description:
        "Specialized streams in Science, Commerce, and Humanities...",
      gridSize: { xs: 12, sm: 12, md: 4 },
      sx: {
        color: "white",
        backgroundColor: "red",
        fontSize: "0.7rem",
      },
      buttonText: "Learn about our results",
      buttonIcon: <TrendingUpIcon sx={{ fontSize: "1.2rem", ml: 0.5 }} />,
    },
  ];

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      {/* heading */}
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

      {/* subtext */}
      <Box
        component="p"
        sx={{
          color: "#555",
          textAlign: "center",
          mt: 2,
          maxWidth: "700px",
          mx: "auto",
          fontSize: { xs: "1rem", md: "1.1rem" },
        }}
      >
        From early childhood development to advanced secondary education, we
        provide a structured curriculum designed for success.
      </Box>

      {/* grid */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mt: 4 }}>
        {academicExcellenceData.map((item, index) => (
          <Grid key={index} size={item.gridSize}>
            <Box
              sx={{
                border: "1px solid #eee",
                borderRadius: 3,
                p: { xs: 2, md: 2.5 },

                display: "flex",
                gap: 2,
                flexDirection: {
                  xs: "column",
                  sm: item.img ? "row" : "column",
                },

                textAlign: "left",
                height: "100%",

                ...(item.sx || {}),

                transition: "all 0.3s ease",

                "@media (hover: hover)": {
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  },
                },
              }}
            >
              {/* text */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {/* badge */}
                {item.badge && (
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      width: "fit-content",
                      px: 2,
                      py: 0.5,
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      mb: 1,
                      ...(item.badgesx || {}),
                    }}
                  >
                    {item.badge}
                  </Box>
                )}

                {/* title */}
                <Box
                  component="h2"
                  sx={{
                    mb: 0.5,
                    fontSize: { xs: "1.3rem", md: "1.5rem" },
                    fontWeight: 600,
                    ...item.titlesx,
                  }}
                >
                  {item.title}
                </Box>

                {/* Description */}
                <Box
                  component="p"
                  sx={{
                    fontSize: { xs: "0.95rem", md: "1rem" },
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </Box>

                {/* button */}
                {item.buttonText && (
                  <Button
                    sx={{
                      mt: 1.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontWeight: "bold",
                      color: "inherit",

                      "&:hover span": {
                        transform: "translateX(4px)",
                      },
                    }}
                    href="/academics"
                  >
                    {item.buttonText}
                    <Box
                      component="span"
                      sx={{
                        display: "flex",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {item.buttonIcon}
                    </Box>
                  </Button>
                )}
              </Box>

              {/* image */}
              {item.img && (
                <Box
                  component="img"
                  src={item.img}
                  alt={item.title}
                  sx={{
                    width: { xs: "100%", sm: "35%" },
                    maxHeight: 160,
                    objectFit: "cover",
                    borderRadius: 3,
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
