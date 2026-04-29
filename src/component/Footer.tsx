import { Container, Box, Link } from "@mui/material";
import FisLogo from "../assets/FIS_logo.png";
import { NavLink } from "react-router-dom";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import useMediaQuery from "@mui/material/useMediaQuery";

function Footer() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const smallWidthMobile = useMediaQuery("(max-width: 446px)");

  const links = [
    { label: "About Us", path: "/about_us" },
    { label: "Facilities", path: "/facilities" },
    { label: "Academics", path: "/academics" },
    { label: "News & Events", path: "/news_and_events" },
    { label: "Contact", path: "/contact" },
  ];

  const handleCall = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  const handleMap = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Container
      sx={{
        color: "#555",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 4,
          padding: "30px 20px",
        }}
      >
        <Box
          sx={{
            display: isMobile ? "none" : "flex",
            padding: 0,
            margin: 0,
            alignItems: "start",
            justifyContent: "start",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              flexDirection: "column",
            }}
          >
            <Link to={"/"} component={NavLink}>
              <img src={FisLogo} alt="logo" style={{ width: "100%" }} />
            </Link>
          </Box>
          <Box sx={{ fontSize: "1.2rem", fontWeight: "bold" }}>
            Fairyland Secondary School
          </Box>
        </Box>
        {/* school info */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* location */}
          <Box
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                color: "black",
                textDecoration: "underline",
              },
            }}
            onClick={() =>
              handleMap(
                "https://www.google.com/maps/dir//Fairyland+International+School,+Budhanilkantha+44600/@27.7421116,85.3495983,17z/data=!4m16!1m7!3m6!1s0x39eb1957fa4cdb53:0x504011f462b81340!2sFairyland+International+School!8m2!3d27.7421117!4d85.3544639!16s%2Fg%2F11cpfv_9cr!4m7!1m0!1m5!1m1!1s0x39eb1957fa4cdb53:0x504011f462b81340!2m2!1d85.3544639!2d27.7421117?entry=ttu&g_ep=EgoyMDI2MDQyMi4wIKXMDSoASAFQAw%3D%3D",
              )
            }
          >
            <LocationPinIcon /> Kapan, Jyotinagar
          </Box>

          {/* phone */}
          <Box
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
            onClick={() => handleCall("014164344")}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                "@media (hover: hover) and (pointer: fine)": {
                  "&:hover": {
                    color: "black",
                    textDecoration: "underline",
                  },
                },
              }}
            >
              <LocalPhoneIcon /> 01-4164344
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: "0.9rem",
                color: "gray",
                "@media (hover: hover) and (pointer: fine)": {
                  "&:hover": {
                    color: "black",
                    textDecoration: "underline",
                  },
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleCall("01416023");
              }}
            >
              ext. 01416023
            </Box>
          </Box>
        </Box>
        {/* nav links */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.2,
          }}
        >
          <Box
            sx={{
              fontSize: "20px",
              fontWeight: "bold",
              margin: 0,
              padding: 0,
              color: "#555",
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
              alignItems: smallWidthMobile ? "start" : "end",
            }}
          >
            {" "}
            Quick Links
            {links.map((item, i) => (
              <Link
                key={i}
                component={NavLink}
                to={item.path}
                sx={{
                  padding: "4px",
                  fontSize: "16px",
                  textDecoration: "none",
                  fontWeight: "normal",
                  color: "#555",
                  "@media (hover: hover) and (pointer: fine)": {
                    "&:hover": {
                      color: "black",
                      textDecoration: "underline",
                    },
                  },
                }}
              >
                {item.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Box>
      <hr />
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box>© Copyright 2026. All Rights Reserved.</Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Link
            sx={{
              color: "#555",
              "@media (hover: hover) and (pointer: fine)": {
                "&:hover": {
                  color: "black",
                },
              },
            }}
            href="https://www.facebook.com/fairyland.schooll/"
          >
            {" "}
            <FacebookIcon />
          </Link>{" "}
          <Link
            href="https://www.tiktok.com/@fairylandintschool"
            sx={{
              color: "#555",
              cursor: "pointer",
              display: "flex",
              "&:hover": {
                color: "black",
              },
              "@media (hover: hover) and (pointer: fine)": {
                "&:hover": {
                  color: "black",
                },
              },
            }}
          >
            <svg
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="24px"
              height="24px"
            >
              <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
            </svg>
          </Link>
          <Link
            sx={{
              color: "#555",
              "@media (hover: hover) and (pointer: fine)": {
                "&:hover": {
                  color: "black",
                },
              },
            }}
            href="https://www.youtube.com/@bishnuchandraadhikari2772"
          >
            {" "}
            <YouTubeIcon />
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Footer;
