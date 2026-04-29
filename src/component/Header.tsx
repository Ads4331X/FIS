import { NavLink } from "react-router-dom";
import { Box, Container, Link } from "@mui/material";
import FisLogo from "../assets/FIS_logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

function Header() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [showOpenMenuIcon, setShowOpenMenuIcon] = useState(false);

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
          <Link to={"/"} component={NavLink}>
            <img src={FisLogo} alt="logo" style={{ width: "100%" }} />
          </Link>
        </Box>

        <Box component="nav" sx={{ display: "flex", gap: 2 }}>
          {/* Hamburger icon */}
          {isMobile &&
            (!showOpenMenuIcon ? (
              <MenuIcon
                onClick={() => setShowOpenMenuIcon(true)}
                sx={{
                  cursor: "pointer",
                  transform: showOpenMenuIcon
                    ? "rotate(90deg)"
                    : "rotate(0deg)",
                }}
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
                display: isMobile ? "none" : "flex",
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

      {isMobile && (
        <Box
          sx={{
            marginTop: 1,
            width: "100%",
            padding: 0,
            overflow: "hidden",
            maxHeight: showOpenMenuIcon ? 300 : 0,
            opacity: showOpenMenuIcon ? 1 : 0,
            transition: "all 0.4s ease",
          }}
        >
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
                maxHeight: showOpenMenuIcon ? 300 : 0,
                opacity: showOpenMenuIcon ? 1 : 0,
                borderBottom: "1px solid #ddd",
                transform: showOpenMenuIcon
                  ? "translateY(0)"
                  : "translateY(-10px)",
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",

                padding: "10px 0",
                "&.active": { color: "#0d6efd" },
              }}
              onClick={() => setShowOpenMenuIcon(false)}
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
