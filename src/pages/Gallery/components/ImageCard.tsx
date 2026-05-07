import { useState } from "react";
import { Box, Skeleton } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { getThumbnailUrl, type GalleryImage } from "../../../services/Cloudinary";

type ImageCardProps = {
  image: GalleryImage;
  onClick: () => void;
};

export function ImageCard({ image, onClick }: ImageCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        width: "100%",
        height: "100%",
        bgcolor: "transparent",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
        }}
      >
        {!loaded && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}
        <Box
          component="img"
          src={getThumbnailUrl(image.public_id)}
          alt={image.display_name || "Gallery image"}
          onLoad={() => setLoaded(true)}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: loaded ? "block" : "none",
            transition: "transform 0.4s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: "rgba(15,23,42,0.55)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ZoomInIcon sx={{ color: "white", fontSize: 38 }} />
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          left: 8,
          bgcolor: "rgba(0,0,0,0.55)",
          color: "white",
          fontSize: "0.7rem",
          px: 1,
          py: 0.3,
          borderRadius: 1,
          backdropFilter: "blur(4px)",
        }}
      >
        {image.folder?.split("/").pop() ?? ""}
      </Box>
    </Box>
  );
}
