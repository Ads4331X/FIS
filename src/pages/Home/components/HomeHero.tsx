import { Box, Container, Button } from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

export default function HomeHero() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center",
        alignItems: "center",
        gap: { xs: 6, md: 10 },
        padding: { xs: "20px 10px", md: "40px 20px" },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          maxWidth: { md: "700px" },
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
          gap: 2,
        }}
      >
        {/* badge */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: { xs: "center", md: "center" },
            gap: 1,
            borderRadius: 100,
            padding: "5px 10px",
            backgroundColor: "#E0E7FF",
            width: "fit-content",
          }}
        >
          <Box>
            <SchoolOutlinedIcon sx={{ color: "#074783" }} />
          </Box>
          <Box
            sx={{
              color: "#074783",
              textAlign: "center",
              fontSize: "0.95rem",
            }}
          >
            Established Since 2009
          </Box>
        </Box>
        {/* title */}
        <Box
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
            fontWeight: "bold",
            color: "#074783",
            marginTop: 2,
          }}
        >
          Empowering Minds at{" "}
          <Box
            component={"span"}
            sx={{
              color: "red",
            }}
          >
            {" "}
            Fairyland
          </Box>{" "}
          Secondary School{" "}
        </Box>
        {/* short description */}
        <Box
          sx={{
            fontSize: "1.25rem",
            color: "#4B5563",
            marginTop: 2,
          }}
        >
          Providing a nurturing environment where academic excellence meets
          holistic development. Join our community of lifelong learners and
          future leaders.{" "}
        </Box>

        {/* action buttons */}
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginLeft: 2,
              backgroundColor: "#074783",
              transform: "translateY(0)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#074783",
                opacity: 0.9,
                transform: "translateY(-2px)",
              },
            }}
            href="/apply_now"
          >
            Start Your Journey <ArrowRightAltOutlinedIcon fontSize="medium" />
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: "#2D609D",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginLeft: 2,
              transform: "translateY(0)",
              transition: "all 0.3s ease",
              "&:hover": {
                opacity: 0.9,
                transform: "translateY(-2px)",
              },
            }}
          >
            View Prospectus <DownloadOutlinedIcon fontSize="medium" />
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          maxWidth: { xs: "100%", sm: "380px", md: "420px", lg: "450px" },
        }}
      >
        {/* school image */}
        <Box
          component="img"
          src="/images/school.jpg"
          alt="school"
          sx={{
            width: "100%",
            borderRadius: "12px",
            transform: { md: "rotate(2deg)" },
            transition: "all 0.3s ease",

            "&:hover": {
              transform: { md: "rotate(0deg) translateY(-5px)" },
            },
          }}
        />

        {/* badge */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-20px",
            left: { xs: "0px", md: "-8px" },
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.4) 100%)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            color: "#1F3A5F",
            fontWeight: "bold",
            fontSize: "0.95rem",
            padding: "12px 16px",
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            boxShadow: "-1px 0px 0 2px #c62828",
            transform: "rotate(-2deg)",
            maxWidth: "200px",
          }}
        >
          Ranked #1{" "}
          <Box component="span" sx={{ color: "#6B7280", fontWeight: 400 }}>
            In Academic Progress 2023
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
