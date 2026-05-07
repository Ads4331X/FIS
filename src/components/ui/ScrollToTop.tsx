import { useCallback } from "react";
import { Fab, Fade, useMediaQuery, useScrollTrigger, useTheme } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function ScrollToTop() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 300,
  });

  const handleClick = useCallback(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  }, []);

  return (
    <Fade in={trigger} timeout={{ enter: 300, exit: 200 }} unmountOnExit>
      <Fab
        aria-label="Scroll to top"
        onClick={handleClick}
        size={isMobile ? "medium" : "large"}
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 24, md: 32 },
          right: { xs: 16, sm: 24, md: 32 },
          zIndex: (t) => t.zIndex.tooltip + 1,

          color: "#fff",

          background:
            "linear-gradient(135deg, #074783 0%, #0A6BBF 50%, #1294ff 100%)",

          backdropFilter: "blur(10px)",

          boxShadow:
            "0 10px 25px rgba(7, 71, 131, 0.28), inset 0 1px 1px rgba(255,255,255,0.12)",

          border: "1px solid rgba(255,255,255,0.12)",

          willChange: "transform, box-shadow, filter",

          transition: `
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 320ms ease,
            background 500ms ease
          `,

          "&:hover": {
            transform: "translateY(-6px)",

            background:
              "linear-gradient(135deg, #0A6BBF 0%, #1294ff 50%, #38b6ff 100%)",

            boxShadow: `
              0 18px 40px rgba(18, 148, 255, 0.35),
              0 0 20px rgba(18, 148, 255, 0.25)
            `,

            filter: "brightness(1.08)",
          },

          "&:active": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 20px rgba(18, 148, 255, 0.3)",
          },

          "&:focus-visible": {
            outline: "2px solid rgba(255,255,255,0.9)",
            outlineOffset: 3,
          },

          "& .MuiSvgIcon-root": {
            transition: "transform 300ms ease",
          },

          "&:hover .MuiSvgIcon-root": {
            transform: "translateY(-3px)",
          },

          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            padding: "2px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0))",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            pointerEvents: "none",
          },

          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",

            "&:hover": {
              transform: "none",
            },

            "&:active": {
              transform: "none",
            },

            "& .MuiSvgIcon-root": {
              transition: "none",
            },

            "&:hover .MuiSvgIcon-root": {
              transform: "none",
            },
          },
        }}
      >
        <KeyboardArrowUpIcon fontSize={isMobile ? "medium" : "large"} />
      </Fab>
    </Fade>
  );
}

export default ScrollToTop;
