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
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        color: "#1F2937",
        px: { xs: 2, sm: 3, md: 4 },
        py: 0,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: { xs: 52, sm: 58, md: 64 },
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
              sx={{
                width: { xs: 36, sm: 42, md: 48 },
                height: { xs: 36, sm: 42, md: 48 },
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={FisLogo}
                alt={SITE_NAME}
                style={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Link>
          <Box
            sx={{
              fontWeight: "bold",
              color: "#074783",
              fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              whiteSpace: "nowrap",
            }}
          >
            {SITE_NAME}
          </Box>
        </Box>

        {/* Desktop Nav Links — centered absolutely */}
        {!isMobile && (
          <Box
            component="nav"
            sx={{
              display: "flex",
              gap: { sm: 0.5, md: 1, lg: 2 },
              alignItems: "center",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {centeredNavLinks.map((item) => (
              <Link
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  color: "#555",
                  fontSize: { sm: "0.82rem", md: "0.88rem", lg: "0.95rem" },
                  fontWeight: "bold",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  padding: { sm: "5px 5px", md: "5px 6px", lg: "6px 8px" },
                  borderBottom: "2px solid transparent",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
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

        {/* Right side: Apply Now (desktop) or Hamburger (mobile) */}
        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          {/* Apply Now — always visible on desktop (>820px) */}
          {!isMobile && applyNowLink && (
            <Link
              component={NavLink}
              to={applyNowLink.path}
              sx={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: { sm: "0.82rem", md: "0.88rem", lg: "0.95rem" },
                fontWeight: "bold",
                padding: { sm: "6px 10px", md: "7px 12px", lg: "8px 14px" },
                borderRadius: "999px",
                border: "1px solid #074783",
                color: "#074783",
                backgroundColor: "transparent",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "#074783",
                },
                "&.active": {
                  color: "#ffffff",
                  backgroundColor: "#074783",
                },
              }}
            >
              {applyNowLink.label}
            </Link>
          )}

          {/* Hamburger — mobile only */}
          {isMobile && (
            <IconButton
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
              size="small"
              sx={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {menuOpen ? (
                <MenuOpenIcon sx={{ fontSize: 30 }} />
              ) : (
                <MenuIcon sx={{ fontSize: 30 }} />
              )}
            </IconButton>
          )}
        </Box>
      </Container>

      {/* Mobile Dropdown Menu */}
      {isMobile && (
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
            maxHeight: menuOpen ? 400 : 0,
            opacity: menuOpen ? 1 : 0,
            transition: "max-height 0.4s ease, opacity 0.3s ease",
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
                fontWeight: "bold",
                color: "#1F2937",
                fontSize: "0.95rem",
                borderBottom: "1px solid #ddd",
                padding: "10px 16px",
                transform: menuOpen ? "translateY(0)" : "translateY(-10px)",
                transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                "&.active": { color: "#074783" },
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
