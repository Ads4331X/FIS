import { useState, useEffect, useRef } from "react";
import { Box, Button, CircularProgress, Container, Typography } from "@mui/material";
import { fetchImages, type GalleryImage } from "../../services/Cloudinary";
import { CategoryFilter } from "./components/CategoryFilter";
import { GalleryGrid } from "./components/GalleryGrid";
import { Lightbox } from "./components/Lightbox";
import { GalleryCta } from "./components/GalleryCta";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const loadTimerRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (loadTimerRef.current !== null) {
      window.clearTimeout(loadTimerRef.current);
    }

    let active = true;
    const requestId = ++requestIdRef.current;

    // Reset state immediately on category change
    setImages([]);
    setNextCursor(null);

    loadTimerRef.current = window.setTimeout(async () => {
      if (!active) return;
      setLoading(true);
      setError("");
      try {
        const { images: imgs, nextCursor: cursor } = await fetchImages(activeCategory);
        if (!active || requestId !== requestIdRef.current) return;
        setImages(imgs);
        setNextCursor(cursor);
      } catch (e) {
        if (!active || requestId !== requestIdRef.current) return;
        setImages([]);
        setError(e instanceof Error ? e.message : "Could not load images.");
      } finally {
        if (active && requestId === requestIdRef.current) setLoading(false);
      }
    }, 0);

    return () => {
      active = false;
      if (loadTimerRef.current !== null) {
        window.clearTimeout(loadTimerRef.current);
      }
    };
  }, [activeCategory]);

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;

    const requestId = ++requestIdRef.current;
    setLoadingMore(true);
    setError("");

    try {
      const { images: moreImages, nextCursor: newCursor } = await fetchImages(
        activeCategory,
        nextCursor
      );
      if (requestId !== requestIdRef.current) return;
      setImages((prev) => [...prev, ...moreImages]);
      setNextCursor(newCursor);
    } catch (e) {
      if (requestId !== requestIdRef.current) return;
      setError(e instanceof Error ? e.message : "Could not load more images.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingMore(false);
      }
    }
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () =>
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + images.length) % images.length : null,
    );
  const nextImage = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));

  return (
    <Box sx={{ bgcolor: "#F5F7FB", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 4, md: 6 } }}>
        <Box sx={{ textAlign: "center", maxWidth: 860, mx: "auto", mb: { xs: 3, md: 4 } }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.7rem", sm: "2.1rem", md: "2.6rem" },
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: "#0f172a",
              mb: 1.25,
            }}
          >
            Capturing Academic Excellence
          </Typography>
          <Typography
            sx={{
              color: "#64748b",
              fontSize: { xs: "0.92rem", sm: "0.98rem", md: "1.05rem" },
              lineHeight: 1.8,
            }}
          >
            Explore the vibrant life at Fairyland Secondary School through our visual journey of discovery and growth.
          </Typography>
        </Box>

        <CategoryFilter
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
        {error && (
          <Typography
            sx={{
              color: "#dc2626",
              mb: 2,
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </Typography>
        )}

        {/* Image Count */}
        {!loading && (
          <Typography
            sx={{
              color: "#6b7280",
              mb: 3,
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            {images.length === 0
              ? "No images yet"
              : `${images.length} photo${images.length !== 1 ? "s" : ""}`}
          </Typography>
        )}

        <GalleryGrid
          loading={loading}
          images={images}
          onImageClick={openLightbox}
        />

        {/* Load More */}
        {!loading && images.length > 0 && nextCursor && (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="outlined"
              onClick={handleLoadMore}
              disabled={loadingMore}
              sx={{
                minWidth: 160,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {loadingMore ? (
                <>
                  <CircularProgress size={18} sx={{ mr: 1 }} />
                  Loading…
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </Box>
        )}
      </Container>

      <GalleryCta />

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </Box>
  );
}
