import { Box, Skeleton, Typography } from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import { type GalleryImage } from "../../../services/Cloudinary";
import { ImageCard } from "./ImageCard";

type GalleryGridProps = {
  loading: boolean;
  images: GalleryImage[];
  onImageClick: (index: number) => void;
};

const gridStyles = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)", md: "repeat(6, 1fr)" },
  gap: { xs: 1.5, sm: 2 },
  gridAutoFlow: "dense",
  gridAutoRows: { xs: 120, sm: 140, md: 160 },
};

function getItemSx(index: number) {
  if (index === 0) {
    return {
      gridColumn: { xs: "span 2", sm: "span 4", md: "span 4" },
      gridRow: { xs: "span 2", sm: "span 2", md: "span 2" },
    };
  }
  if (index === 1) {
    return {
      gridColumn: { xs: "span 2", sm: "span 2", md: "span 2" },
      gridRow: { xs: "span 2", sm: "span 1", md: "span 2" },
    };
  }
  return {
    gridColumn: { xs: "span 1", sm: "span 2", md: "span 2" },
    gridRow: { xs: "span 1", sm: "span 1", md: "span 1" },
  };
}

export function GalleryGrid({ loading, images, onImageClick }: GalleryGridProps) {
  if (loading) {
    return (
      <Box sx={gridStyles}>
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            sx={{
              ...getItemSx(index),
              borderRadius: 2,
              width: "100%",
              height: "100%",
            }}
          />
        ))}
      </Box>
    );
  }

  if (images.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          color: "#9ca3af",
        }}
      >
        <CollectionsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.4 }} />
        <Typography sx={{ fontSize: "1.1rem" }}>No photos in this category yet.</Typography>
        <Typography sx={{ fontSize: "0.9rem", mt: 0.5 }}>Check back soon!</Typography>
      </Box>
    );
  }

  return (
    <Box sx={gridStyles}>
      {images.map((image, index) => (
        <Box key={image.public_id} sx={getItemSx(index)}>
          <ImageCard image={image} onClick={() => onImageClick(index)} />
        </Box>
      ))}
    </Box>
  );
}
