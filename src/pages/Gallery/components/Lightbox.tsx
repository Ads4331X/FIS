import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getImageUrl, type GalleryImage } from "../../../services/Cloudinary";

type LightboxProps = {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const img = images[index];

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        bgcolor: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      <Box
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: "white",
          cursor: "pointer",
          bgcolor: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          p: 1,
          display: "flex",
          "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
        }}
      >
        <CloseIcon />
      </Box>

      <Box
        onClick={(event) => {
          event.stopPropagation();
          onPrev();
        }}
        sx={{
          position: "absolute",
          left: { xs: 8, md: 24 },
          color: "white",
          cursor: "pointer",
          bgcolor: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          p: 1.5,
          display: "flex",
          "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
        }}
      >
        <ArrowBackIosNewIcon />
      </Box>

      <Box
        onClick={(event) => event.stopPropagation()}
        sx={{ maxWidth: "85vw", maxHeight: "85vh" }}
      >
        <Box
          component="img"
          src={getImageUrl(img.public_id, 1200)}
          alt={img.display_name || img.public_id}
          sx={{
            maxWidth: "85vw",
            maxHeight: "85vh",
            objectFit: "contain",
            borderRadius: 2,
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          }}
        />
        <Typography
          sx={{
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            mt: 1.5,
            fontSize: "0.85rem",
          }}
        >
          {index + 1} / {images.length}
        </Typography>
      </Box>

      <Box
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        sx={{
          position: "absolute",
          right: { xs: 8, md: 24 },
          color: "white",
          cursor: "pointer",
          bgcolor: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          p: 1.5,
          display: "flex",
          "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
        }}
      >
        <ArrowForwardIosIcon />
      </Box>
    </Box>
  );
}
