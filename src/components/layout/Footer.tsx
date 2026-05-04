import { Container, Box, Link } from "@mui/material";
import FisLogo from "../../assets/FIS_logo.png";
import { NavLink } from "react-router-dom";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";
import { siteContact } from "../../constants/siteContact";
import { TikTokIcon } from "../icons/TikTokIcon";

function Footer() {
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Link component={NavLink} to="/">
                <img src={FisLogo} alt="logo" width={28} />
              </Link>
              <Box sx={{ fontWeight: "bold", color: "#074783" }}>
                Fairyland Secondary School
              </Box>
            </Box>

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
              onClick={() => handleMap(siteContact.mapOpenUrl)}
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
              {siteContact.addressDisplay}
            </Box>

            {/* phone */}
            <Box
              onClick={() => handleCall(siteContact.phoneTel)}
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
              {siteContact.phoneDisplay}
            </Box>

            {/* email */}
            <Link
              href={`mailto:${siteContact.email}`}
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
              {siteContact.email}
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

          {/* socials — same order as Contact aside */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Link href={siteContact.social.facebook} sx={{ color: "#555" }} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon />
            </Link>
            <Link href={siteContact.social.youtube} sx={{ color: "#555" }} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <YouTubeIcon />
            </Link>
            <Link href={siteContact.social.tiktok} sx={{ color: "#555" }} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <TikTokIcon />
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
