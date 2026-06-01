import { NavLink } from "react-router-dom";
import { Box, Container, IconButton, Link } from "@mui/material";
import FisLogo from "../../assets/FIS_logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { primaryNavigationLinks } from "../../constants/navigationLinks";
import { SITE_NAME } from "../../constants/siteContact";

function Header() {
  const isMobile = useMediaQuery("(max-width:820px)");
  const [menuOpen, setMenuOpen] = useState(false);

  const applyNowLink = primaryNavigationLinks.find(
    (link) => link.path === "/apply_now",
  );
  const centeredNavLinks = primaryNavigationLinks.filter(
    (link) => link.path !== "/apply_now",
  );

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        color: "#1F2937",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          height: { xs: 56, sm: 60, md: 64 },
          px: { xs: 2, sm: 3, md: 4 },
          gap: 2,
        }}
      >
        {/* Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}
        >
          <Link
            to="/"
            component={NavLink}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box
              component="img"
              src={FisLogo}
              alt={SITE_NAME}
              sx={{
                width: { xs: 36, sm: 40, md: 44 },
                height: { xs: 36, sm: 40, md: 44 },
                objectFit: "contain",
              }}
            />
          </Link>
          <Box
            sx={{
              fontWeight: 800,
              color: "#074783",
              // clamp: shrinks fluidly between breakpoints
              fontSize: "clamp(0.7rem, 1.2vw, 1rem)",
              lineHeight: 1.2,
              // allow site name to shrink but never disappear
              flexShrink: 1,
              minWidth: 0,
              maxWidth: { xs: 140, sm: 180, md: 220 },
              // overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {SITE_NAME}
          </Box>
        </Box>

        {/* Desktop Nav   flex, shrinks with viewport, no wrapping */}
        {!isMobile && (
          <Box
            component="nav"
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              justifyContent: "center",
              gap: 0,
              overflow: "hidden",
              minWidth: 0,
            }}
          >
            {centeredNavLinks.map((item) => (
              <Link
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  color: "#555",
                  // fluid font: shrinks with viewport
                  fontSize: "clamp(0.68rem, 0.9vw, 0.9rem)",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  // fluid padding: tightens on narrower screens
                  px: "clamp(4px, 0.7vw, 12px)",
                  py: "6px",
                  borderBottom: "2px solid transparent",
                  flexShrink: 1,
                  transition: "all 0.25s ease",
                  borderRadius: "4px 4px 0 0",
                  "&:hover": {
                    color: "#074783",
                    borderBottom: "2px solid #074783",
                  },
                  "&.active": {
                    color: "#074783",
                    borderBottom: "2px solid #eb2525",
                  },
                }}
              >
                {item.label}
              </Link>
            ))}
          </Box>
        )}

        {/* Right side */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            ml: "auto",
          }}
        >
          {!isMobile && applyNowLink && (
            <Link
              component={NavLink}
              to={applyNowLink.path}
              sx={{
                textDecoration: "none",
                fontSize: "clamp(0.68rem, 0.9vw, 0.88rem)",
                fontWeight: 700,
                px: { sm: "10px", md: "14px", lg: "18px" },
                py: "8px",
                borderRadius: "999px",
                border: "2px solid #074783",
                color: "#074783",
                backgroundColor: "transparent",
                whiteSpace: "nowrap",
                transition: "all 0.25s ease",
                "&:hover": { color: "#ffffff", backgroundColor: "#074783" },
                "&.active": { color: "#ffffff", backgroundColor: "#074783" },
              }}
            >
              {applyNowLink.label}
            </Link>
          )}

          {isMobile && (
            <IconButton
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
              size="small"
            >
              {menuOpen ? (
                <MenuOpenIcon sx={{ fontSize: 28 }} />
              ) : (
                <MenuIcon sx={{ fontSize: 28 }} />
              )}
            </IconButton>
          )}
        </Box>
      </Container>

      {/* Mobile Dropdown */}
      {isMobile && (
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
            maxHeight: menuOpen ? 500 : 0,
            opacity: menuOpen ? 1 : 0,
            transition: "max-height 0.4s ease, opacity 0.3s ease",
            borderTop: menuOpen ? "1px solid #eee" : "none",
          }}
        >
          {primaryNavigationLinks.map((item) => (
            <Link
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                display: "flex",
                textDecoration: "none",
                fontWeight: 700,
                color: "#1F2937",
                fontSize: "0.95rem",
                borderBottom: "1px solid #f0f0f0",
                px: 3,
                py: "12px",
                transition: "background 0.2s, color 0.2s",
                "&:hover": { backgroundColor: "#f0f4ff", color: "#074783" },
                "&.active": { color: "#074783", backgroundColor: "#f0f4ff" },
              }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Header;
