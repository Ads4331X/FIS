import { Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

export default function HomeSubContent() {
  const features = [
    {
      logo: <GroupsIcon fontSize="large" />,
      title: "15:1",
      description: "Student-Teacher Ratio",
      sx: { color: "#074783" },
    },
    {
      logo: <VerifiedOutlinedIcon fontSize="large" />,
      title: "100%",
      description: "Board Examination Results",
      sx: { color: "red", backgroundColor: "#FEE2E2" },
    },
    {
      logo: <EmojiEventsOutlinedIcon fontSize="large" />,
      title: "25+",
      description: "Extracurricular Activities",
      sx: { color: "gold", backgroundColor: "#FEF9C3" },
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: { xs: 3, md: 5 },
        flexWrap: "wrap",
        margin: 4,
        padding: { xs: "30px 15px", sm: "40px 20px", md: "50px 30px" },
        backgroundColor: "#F9FAFB",
      }}
    >
      {features.map((feature, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s ease",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 10px 20px rgba(0,0,0,0.12)",
            },

            flex: "1 1 250px",
            maxWidth: { xs: "100%", sm: 280, md: 300 },

            backgroundColor: "#fff",
            padding: { xs: "30px 20px", md: "50px 30px" },

            borderRadius: 2,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          {/* icon */}
          <Box
            sx={{
              borderRadius: "50%",
              padding: 2,
              backgroundColor: "#E0E7FF",
              ...feature.sx,
            }}
          >
            {feature.logo}
          </Box>

          {/* title */}
          <Box
            sx={{
              fontSize: { xs: "1.4rem", md: "1.8rem" },
              fontWeight: "bold",
              marginTop: 2,
              color: "#074783",
            }}
          >
            {feature.title}
          </Box>

          {/* description */}
          <Box
            sx={{
              color: "#555",
              fontSize: { xs: "1rem", md: "1.1rem" },
              marginTop: 1,
            }}
          >
            {feature.description}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
