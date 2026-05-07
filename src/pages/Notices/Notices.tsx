import { useEffect, useState, type ChangeEvent } from "react";
import { Box, Button, Container, Pagination, Typography } from "@mui/material";
import { fetchNotices, type NoticeItem } from "../../services/Cloudinary";
import { NoticeHero } from "./components/NoticeHero";
import { NoticeGrid } from "./components/NoticeGrid";

export default function Notices() {
  const PAGE_SIZE = 6;
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const { notices: loadedNotices, nextCursor: cursor } = await fetchNotices();
        if (!active) return;
        setNotices(loadedNotices);
        setNextCursor(cursor);
        setPage(1);
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
      const { notices: loadedNotices, nextCursor: cursor } = await fetchNotices(nextCursor);
      setNotices((prev) => [...prev, ...loadedNotices]);
      setNextCursor(cursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load more notices.");
    } finally {
      setLoadingMore(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(notices.length / PAGE_SIZE));
  const paginatedNotices = notices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
        <NoticeGrid loading={loading} notices={paginatedNotices} />
        {!loading && notices.length > PAGE_SIZE && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" />
          </Box>
        )}
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
