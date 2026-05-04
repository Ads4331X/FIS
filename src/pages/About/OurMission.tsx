import { Box, Container } from "@mui/material";
import { Counter } from "../../components/ui/Counter";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

export function OurMission() {
  return (
    <Box sx={{ backgroundColor: "#F9FAFB" }}>
      <Container
        maxWidth="xl"
        sx={{ padding: { xs: "20px 10px", md: "40px 20px" } }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
            alignItems: "stretch",
          }}
        >
          {/* left card */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 1,
              transition: "all 0.25s ease",
              backgroundColor: "#fff",
              padding: { xs: "30px 20px", md: "50px 40px" },
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              textAlign: "left",
              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
              },
            }}
          >
            {/* heading */}
            <Box
              component="h4"
              sx={{
                m: 0,
                color: "red",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <AutoAwesomeOutlinedIcon /> Our Mission
            </Box>

            {/* title */}
            <Box
              component="h1"
              sx={{
                m: 0,
                mt: 1,
                color: "#074783",
                fontSize: { xs: "1.5rem", md: "2rem" },
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              To inspire curiosity and cultivate lifelong learners.
            </Box>

            {/* description */}
            <Box
              component="p"
              sx={{
                m: 0,
                mt: 2,
                color: "#555",
                fontSize: "1.1rem",
                lineHeight: 1.7,
              }}
            >
              Fairyland Secondary School was founded in 2009 with a singular
              vision: to create an educational sanctuary where every child feels
              empowered to explore their potential. We blend traditional values
              with modern pedagogical approaches to prepare students for a
              rapidly changing world.
            </Box>
          </Box>

          {/* image */}
          <Box
            sx={{
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
              aspectRatio: { xs: "16/9", md: "unset" },
              height: { md: "100%" },
              minHeight: { md: 300 },
            }}
          >
            <Box
              component="img"
              src="/images/mission.jpg"
              alt="Our Mission"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.4s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />

            {/*  overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,28,58,0.55), rgba(0,0,0,0.05))",
                pointerEvents: "none",
              }}
            />
          </Box>
        </Box>
        {/* counter */}
        <Box
          sx={{
            padding: "40px",
          }}
        >
          <Counter />
        </Box>
      </Container>
    </Box>
  );
}
