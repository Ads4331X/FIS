import { Container, Box, Link } from "@mui/material";
import FisLogo from "../assets/FIS_logo.png";
import { NavLink } from "react-router-dom";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";
import useMediaQuery from "@mui/material/useMediaQuery";

function Footer() {
  const isMobile = useMediaQuery("(max-width:768px)");

  const links = [
    { label: "About Us", path: "/about_us" },
    { label: "Academics", path: "/academics" },
    { label: "Gallery", path: "/gallery" },
    { label: "Contact", path: "/contact" },
    { label: "Apply Now", path: "/apply_now" },
  ];

  const handleCall = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  const handleMap = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Box sx={{ background: "#F9FAFB" }}>
      <Container sx={{ py: 6 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          {/* logo and descriptions */}
          <Box sx={{ maxWidth: 300 }}>
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Link component={NavLink} to="/">
                  <img src={FisLogo} alt="logo" width={28} />
                </Link>
                <Box sx={{ fontWeight: "bold", color: "#074783" }}>
                  Fairyland Secondary School
                </Box>
              </Box>
            )}

            <Box component="p" sx={{ mt: 2, color: "#555" }}>
              Developing excellence, character, and leadership since 1998. Our
              mission is to provide global education grounded in local values.
            </Box>
          </Box>

          {/* quick links */}
          <Box>
            <Box sx={{ fontWeight: "bold", mb: 1, color: "#074783" }}>
              Quick Links
            </Box>

            {links.map((item, i) => (
              <Link
                key={i}
                component={NavLink}
                to={item.path}
                sx={{
                  display: "block",
                  color: "#555",
                  fontSize: "15px",
                  mb: 0.5,
                  textDecoration: "none",

                  "&:hover": {
                    color: "#000",
                    textDecoration: "underline",
                  },
                }}
              >
                {item.label}
              </Link>
            ))}
          </Box>

          {/* contact */}
          <Box>
            <Box sx={{ fontWeight: "bold", mb: 1, color: "#074783" }}>
              Contact
            </Box>

            {/* location */}
            <Box
              onClick={() =>
                handleMap(
                  "https://www.google.com/maps?q=Fairyland+International+School",
                )
              }
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#555",
                cursor: "pointer",
                mb: 1,

                "&:hover": {
                  color: "#000",
                  textDecoration: "underline",
                },
              }}
            >
              <LocationPinIcon fontSize="small" />
              Kapan, Jyotinagar
            </Box>

            {/* phone */}
            <Box
              onClick={() => handleCall("014164344")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#555",
                cursor: "pointer",
                mb: 1,

                "&:hover": {
                  color: "#000",
                  textDecoration: "underline",
                },
              }}
            >
              <LocalPhoneIcon fontSize="small" />
              01-4164344
            </Box>

            {/* email */}
            <Link
              href="mailto:fairylandinternationalschool@gmail.com"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#555",
                textDecoration: "none",

                "&:hover": {
                  color: "#000",
                  textDecoration: "underline",
                },
              }}
            >
              <EmailIcon fontSize="small" />
              fairylandinternationalschool@gmail.com
            </Link>
          </Box>
        </Box>

        {/* bottom bar */}
        <Box
          sx={{
            mt: 5,
            pt: 3,
            borderTop: "2px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ color: "#777", fontSize: "14px" }}>
            © {new Date().getFullYear()} Fairyland School. All rights reserved.
          </Box>

          {/* socials */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link
              href="https://www.facebook.com/fairyland.schooll/"
              sx={{ color: "#555" }}
            >
              <FacebookIcon />
            </Link>

            <Link
              href="https://www.tiktok.com/@fairylandintschool"
              sx={{ color: "#555" }}
            >
              {/* TikTok SVG */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 50 50"
                fill="currentColor"
              >
                <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
              </svg>
            </Link>

            <Link href="https://www.youtube.com/" sx={{ color: "#555" }}>
              <YouTubeIcon />
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
