import { NavLink } from "react-router-dom";
import { Box, Container, IconButton, Link } from "@mui/material";
import FisLogo from "../../assets/FIS_logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { primaryNavigationLinks } from "../../constants/navigationLinks";

function Header() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setMenuOpen(false);
    }
  }, [isMobile]);

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
        {/* logo */}
        <Box sx={{ width: { xs: 46, sm: 52, md: 58 }, height: { xs: 46, sm: 52, md: 58 } }}>
          <Link to={"/"} component={NavLink}>
            <img src={FisLogo} alt="logo" style={{ width: "100%" }} />
          </Link>
        </Box>

        <Box component="nav" sx={{ display: "flex", gap: { sm: 1, md: 1.5, lg: 2 }, alignItems: "center" }}>
          {/* Hamburger icon */}
          {isMobile && (
            <IconButton aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((prev) => !prev)} size="small">
              {menuOpen ? <MenuOpenIcon sx={{ fontSize: 30 }} /> : <MenuIcon sx={{ fontSize: 30 }} />}
            </IconButton>
          )}

          {primaryNavigationLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                color: isActive ? "#074783" : "#555",
                fontSize: "0.95rem",
                fontWeight: "bold",
                display: isMobile ? "none" : "flex",
                textDecoration: "none",
                justifyContent: "center",
                alignItems: "center",
                padding: "4px 6px",
                borderBottom: isActive
                  ? "2px solid #eb2525"
                  : "2px solid transparent",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </Box>
      </Container>

      {isMobile && (
        <Box
          sx={{
            marginTop: 1,
            width: "100%",
            padding: 0,
            overflow: "hidden",
            maxHeight: menuOpen ? 300 : 0,
            opacity: menuOpen ? 1 : 0,
            transition: "all 0.4s ease",
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
                maxHeight: menuOpen ? 300 : 0,
                opacity: menuOpen ? 1 : 0,
                borderBottom: "1px solid #ddd",
                transform: menuOpen
                  ? "translateY(0)"
                  : "translateY(-10px)",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",

                padding: "8px 0",
                "&.active": { color: "#0d6efd" },
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
