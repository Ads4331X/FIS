import { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { fetchImages, type GalleryImage } from "../../services/Cloudinary";
import { NoticeHero } from "./components/NoticeHero";
import { NoticeGrid } from "./components/NoticeGrid";

const NOTICE_FOLDER = "notices";

export default function Notices() {
  const [notices, setNotices] = useState<GalleryImage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const { images, nextCursor: cursor } = await fetchImages(NOTICE_FOLDER);
        if (!active) return;
        setNotices(images);
        setNextCursor(cursor);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load notices.");
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, []);

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    setError("");
    try {
      const { images, nextCursor: cursor } = await fetchImages(NOTICE_FOLDER, nextCursor);
      setNotices((prev) => [...prev, ...images]);
      setNextCursor(cursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load more notices.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <NoticeHero />
        {error && (
          <Typography sx={{ color: "error.main", textAlign: "center", mb: 2 }}>
            {error}
          </Typography>
        )}
        <NoticeGrid loading={loading} notices={notices} />
        {!loading && nextCursor && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="outlined" onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? "Loading..." : "Load More"}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
