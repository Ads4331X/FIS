import type { ReactNode } from "react";
import { Box, Container, Typography } from "@mui/material";

export type HeroProps = {
  bgImg: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  /** Optional ribbon above the title */
  badge?: string;
  blurBackground?: boolean;
  centered?: boolean;
  /** Shorter viewport height for secondary pages */
  compact?: boolean;
};

export function Hero({
  bgImg,
  title,
  description,
  actions,
  badge,
  blurBackground = false,
  centered = false,
  compact = false,
}: HeroProps) {
  const overlay = blurBackground
    ? "linear-gradient(to bottom, rgba(0, 45, 91, 0.55), rgba(0, 31, 64, 0.72))"
    : "linear-gradient(to right, rgba(0,28,58,0.92), rgba(0,28,58,0.65), rgba(0,28,58,0.35))";

  return (
    <Box
      sx={{
        position: "relative",
        isolation: "isolate",
        minHeight: compact ? { xs: "44vh", md: "50vh" } : { xs: "100dvh", md: "100dvh" },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          zIndex: 0,
          backgroundImage: `url('${bgImg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          filter: blurBackground ? "blur(4px)" : undefined,
          transform: blurBackground ? "scale(1.08)" : undefined,
          ...(blurBackground
            ? { top: -16, left: -16, right: -16, bottom: -16 }
            : {
                inset: 0,
                width: "100%",
                height: "100%",
                minHeight: "100%",
              }),
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          width: "100%",
          height: "100%",
          minHeight: "100%",
          background: overlay,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
          py: compact ? { xs: 5, md: 6 } : { xs: 5, md: 8 },
        }}
      >
        <Box
          sx={{
            maxWidth: centered ? 760 : 640,
            textAlign: centered ? "center" : "left",
            mx: centered ? "auto" : 0,
          }}
        >
          {badge ? (
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                bgcolor: "#B91C1C",
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: "999px",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              {badge}
            </Typography>
          ) : null}
          <Typography
            component="h1"
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: centered
                ? { xs: "1.75rem", sm: "2rem", md: "2.5rem" }
                : { xs: "2rem", md: "3rem" },
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            {title}
          </Typography>
          <Typography
            component="div"
            sx={{
              color: "rgba(220, 234, 255, 0.95)",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              lineHeight: 1.65,
              maxWidth: centered ? 620 : 520,
              mx: centered ? "auto" : 0,
            }}
          >
            {description}
          </Typography>
          {actions ? <Box sx={{ mt: 3 }}>{actions}</Box> : null}
        </Box>
      </Container>
    </Box>
  );
}
