import { Box } from "@mui/material";
import type { ReactNode, Ref } from "react";
import type { SxProps, Theme } from "@mui/material";

export type ProgramCardProps = {
  title: string;
  description: string;
  badge?: string;
  badgeSx?: SxProps<Theme>;
  titleSx?: SxProps<Theme>;
  sx?: SxProps<Theme>;
  img?: string;
  imgWidth?: string;
  extra?: ReactNode;
  cardRef?: Ref<HTMLDivElement>;
};

export function ProgramCard({
  title,
  description,
  badge,
  badgeSx,
  titleSx,
  sx,
  img,
  imgWidth = "35%",
  extra,
  cardRef,
}: ProgramCardProps) {
  return (
    <Box
      ref={cardRef}
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        p: { xs: 2, md: 2.5 },
        display: "flex",
        gap: 2,
        flexDirection: { xs: "column", sm: img ? "row" : "column" },
        textAlign: "left",
        height: "100%",
        transition: "all 0.3s ease",
        "@media (hover: hover)": {
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
          },
        },
        ...sx,
      }}
    >
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        {badge && (
          <Box
            component="span"
            sx={{
              display: "inline-block",
              width: "fit-content",
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: "bold",
              mb: 1,
              ...badgeSx,
            }}
          >
            {badge}
          </Box>
        )}
        <Box
          component="h2"
          sx={{
            mb: 0.5,
            fontSize: { xs: "1.3rem", md: "1.5rem" },
            fontWeight: 600,
            ...titleSx,
          }}
        >
          {title}
        </Box>
        <Box
          component="p"
          sx={{
            m: 0,
            lineHeight: 1.5,
            fontSize: { xs: "0.95rem", md: "1rem" },
          }}
        >
          {description}
        </Box>
        {extra}
      </Box>
      {img && (
        <Box
          component="img"
          src={img}
          alt={title}
          sx={{
            width: { xs: "100%", sm: imgWidth },
            maxHeight: 170,
            objectFit: "cover",
            borderRadius: 3,
            flexShrink: 0,
          }}
        />
      )}
    </Box>
  );
}
