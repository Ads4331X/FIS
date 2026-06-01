import { Container, Box, Typography } from "@mui/material";

export default function PrincipalMessage() {
  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 4, md: 6 },
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src="/images/principal.jpg"
          alt="Principal photo"
          sx={{
            width: "100%",
            maxWidth: { xs: 420, md: 520 },
            borderRadius: 3,
            objectFit: "cover",
            boxShadow: "0 24px 48px rgba(15, 23, 42, 0.12)",
          }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            component="div"
            sx={{
              color: "#B91C1C",
              fontWeight: 700,
              fontSize: "0.95rem",
              mb: 2,
            }}
          >
            Message from the Principal
          </Typography>
          <Typography
            component="h2"
            sx={{
              color: "#0F172A",
              fontSize: { xs: "1.9rem", md: "2.6rem" },
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            A warm welcome to every child and family at our school.
          </Typography>
          <Typography
            component="p"
            sx={{
              color: "#475569",
              mt: 3,
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.8,
            }}
          >
            I am committed to building a safe, joyful and focused learning space
            where each student can grow with confidence. Our school combines
            strong academics, kind relationships and a supportive daily routine.
          </Typography>
          <Typography
            component="p"
            sx={{
              color: "#475569",
              mt: 2,
              fontSize: { xs: "1rem", md: "1.05rem" },
              lineHeight: 1.8,
            }}
          >
            I look forward to welcoming your family and working together to make
            every year meaningful and successful.
          </Typography>
          <Typography
            component="div"
            sx={{
              color: "#0F172A",
              fontWeight: 700,
              mt: 4,
              fontSize: { xs: "1rem", md: "1.05rem" },
            }}
          >
            Mr. Bishnu Chandra Adhakari
          </Typography>
          <Typography
            component="div"
            sx={{ color: "#64748B", fontSize: "0.95rem" }}
          >
            Principal
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
