import { NavLink } from "react-router-dom";
import { Box, Container, Link } from "@mui/material";
import FisLogo from "../assets/FIS_logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useState, useEffect } from "react";

function Header() {
  const [showHamIcon, setShowHamIcon] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const [showOpenMenuIcon, setShowOpenMenuIcon] = useState(false);

  useEffect(() => {
    const handleResize = () => setShowHamIcon(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about_us" },
    { label: "Facilities", path: "/facilities" },
    { label: "Academics", path: "/academics" },
    { label: "News & Events", path: "/news_and_events" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <Box>
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* logo */}
        <Box sx={{ width: 90, height: 90 }}>
          <img src={FisLogo} alt="logo" style={{ width: "100%" }} />
        </Box>

        <Box component="nav" sx={{ display: "flex", gap: 2 }}>
          {/* Hamburger icon */}
          {showHamIcon &&
            (!showOpenMenuIcon ? (
              <MenuIcon
                onClick={() => setShowOpenMenuIcon(true)}
                sx={{ cursor: "pointer" }}
              />
            ) : (
              <MenuOpenIcon
                onClick={() => setShowOpenMenuIcon(false)}
                sx={{ cursor: "pointer" }}
              />
            ))}

          {links.map((item, i) => (
            <Link
              key={i}
              component={NavLink}
              to={item.path}
              sx={{
                display: showHamIcon ? "none" : "flex",
                textDecoration: "none",
                fontWeight: "bold",
                color: "black",
                "@media (hover: hover) and (pointer: fine)": {
                  "&:hover": {
                    color: "#66a3ff",
                    textDecoration: "underline",
                  },
                },
                "&.active": { color: "#0d6efd" },
              }}
            >
              {item.label}
            </Link>
          ))}
        </Box>
      </Container>

      {showHamIcon && showOpenMenuIcon && (
        <Box sx={{ marginTop: 1, width: "100%", padding: 0 }}>
          {links.map((item, i) => (
            <Link
              key={i}
              component={NavLink}
              to={item.path}
              sx={{
                display: "flex",
                textDecoration: "none",
                fontWeight: "bold",
                color: "black",
                borderBottom: "1px solid #ddd",
                padding: "8px 0",
                "&.active": { color: "#0d6efd" },
              }}
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
