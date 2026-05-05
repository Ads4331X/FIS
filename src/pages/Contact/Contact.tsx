import { Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { Hero } from "../../components/ui/Hero";
import Aside from "./Aside";
import Form from "./Form";
import ContactMap from "./Map";
import Stats from "./Stats";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const isVisitRequest =
    searchParams.get("visit")?.toLowerCase() === "true" ||
    searchParams.get("type")?.toLowerCase() === "visit";

  return (
    <Box sx={{ bgcolor: "#F9FAFB", width: "100%", overflowX: "hidden" }}>
      <Hero
        bgImg="/images/school.jpg"
        title={isVisitRequest ? "Schedule a Visit" : "Connect With Us"}
        description="We are here to help you navigate your educational journey. Reach out to our admissions team or visit our campus in Budhanilkantha."
        centered
        compact
        blurBackground
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          boxSizing: "border-box",
          px: { xs: 2, sm: 3, md: 4 },
          mx: "auto",
          maxWidth: "1200px",
        }}
      >
        <Box
          sx={{
            mt: { xs: -3, md: -8 },
            pb: { xs: 2, md: 1 },
            display: "grid",
            gap: { xs: 2, md: 3 },
            alignItems: "start",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.1fr 1fr",
            },
            gridTemplateAreas: {
              xs: `"form" "aside" "map"`,
              md: `"form aside" "map  map"`,
            },
          }}
        >
          <Box sx={{ gridArea: "form", minWidth: 0 }}>
            <Form isVisitRequest={isVisitRequest} />
          </Box>
          <Box sx={{ gridArea: "aside", minWidth: 0 }}>
            <Aside />
          </Box>
          <Box sx={{ gridArea: "map", minWidth: 0 }}>
            <ContactMap />
          </Box>
        </Box>

        <Stats />
      </Box>
    </Box>
  );
}
