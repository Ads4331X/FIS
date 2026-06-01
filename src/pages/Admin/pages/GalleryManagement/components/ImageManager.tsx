import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardMedia,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Pagination,
  Select,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CATEGORIES,
  deleteImage,
  fetchImages,
  getThumbnailUrl,
  type GalleryImage,
} from "../../../../../services/Cloudinary";

export type AdminGalleryView = "all" | "category";

export type AdminGalleryStats = {
  loadedAssets: number;
  loadedBytes: number;
  hasMore: boolean;
};

type ImageManagerProps = {
  refreshKey: number;
  viewMode: AdminGalleryView;
  searchQuery?: string;
  onStatsChange?: (stats: AdminGalleryStats) => void;
};

const FOLDERS = CATEGORIES;
const ALL_CATEGORY_VALUE = "__all__";
const DEFAULT_FOLDER = ALL_CATEGORY_VALUE;
const PAGE_SIZE = 12;

export function ImageManager({
  refreshKey,
  viewMode,
  searchQuery = "",
  onStatsChange,
}: ImageManagerProps) {
  const [folder, setFolder] = useState(DEFAULT_FOLDER);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteMsg, setDeleteMsg] = useState("");
  const [loadMsg, setLoadMsg] = useState("");

  const loadTimerRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const effectiveFolder = useMemo(
    () => (viewMode === "category" ? folder : ALL_CATEGORY_VALUE),
    [viewMode, folder],
  );

  const selectedCategory = useMemo(
    () =>
      FOLDERS.find(
        (c) =>
          (effectiveFolder === ALL_CATEGORY_VALUE ? "" : effectiveFolder) ===
          c.folder,
      ),
    [effectiveFolder],
  );
  const prefixes = useMemo(() => {
    const resolvedFolder =
      effectiveFolder === ALL_CATEGORY_VALUE ? "" : effectiveFolder;
    if (!selectedCategory) return resolvedFolder ? [resolvedFolder] : [];
    if (!selectedCategory.folder) return [];
    return [selectedCategory.folder];
  }, [effectiveFolder, selectedCategory]);

  const visibleImagesBySearch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return images;
    return images.filter((image) => {
      const filename = image.public_id.split("/").pop() ?? "";
      const haystack =
        `${image.display_name ?? ""} ${image.public_id} ${filename}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [images, searchQuery]);

  const sortedImages = useMemo(() => {
    const list = [...visibleImagesBySearch];
    list.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    return list;
  }, [visibleImagesBySearch, viewMode]);

  const totalLoadedPages = Math.max(
    1,
    Math.ceil(sortedImages.length / PAGE_SIZE),
  );
  const visibleImages = sortedImages.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );
  const sectionTitle = viewMode === "category" ? "By Category" : "All Images";

  useEffect(() => {
    if (loadTimerRef.current !== null) {
      window.clearTimeout(loadTimerRef.current);
    }

    let active = true;
    const requestId = ++requestIdRef.current;
    // Defer resetting the page to the async timeout callback to avoid
    // calling setState synchronously inside the effect body which can
    // trigger cascading renders.
    loadTimerRef.current = window.setTimeout(async () => {
      if (!active) return;
      setPage(1);
      setLoading(true);
      setLoadMsg("");
      try {
        const { images: fetchedImages, nextCursor: cursor } =
          await fetchImages(prefixes);
        if (!active || requestId !== requestIdRef.current) return;
        setImages(fetchedImages);
        setNextCursor(cursor);
      } catch (e) {
        if (!active || requestId !== requestIdRef.current) return;
        setImages([]);
        setNextCursor(null);
        setLoadMsg(e instanceof Error ? e.message : "Could not load images.");
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
  }, [folder, refreshKey, viewMode, prefixes]);

  useEffect(() => {
    const loadedBytes = images.reduce(
      (sum, image) => sum + (image.bytes ?? 0),
      0,
    );
    onStatsChange?.({
      loadedAssets: images.length,
      loadedBytes,
      hasMore: Boolean(nextCursor),
    });
  }, [images, nextCursor, onStatsChange]);

  const loadNextChunk = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    setLoadMsg("");
    const requestId = ++requestIdRef.current;
    try {
      const { images: moreImages, nextCursor: cursor } = await fetchImages(
        prefixes,
        nextCursor,
      );
      if (requestId !== requestIdRef.current) return;
      setImages((prev) => [...prev, ...moreImages]);
      setNextCursor(cursor);
    } catch (e) {
      if (requestId !== requestIdRef.current) return;
      setLoadMsg(
        e instanceof Error ? e.message : "Could not load more images.",
      );
    } finally {
      if (requestId === requestIdRef.current) setLoadingMore(false);
    }
  };

  const ensurePageLoaded = async (targetPage: number) => {
    if (targetPage > totalLoadedPages && nextCursor) {
      await loadNextChunk();
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!window.confirm("Delete this image? This cannot be undone.")) return;

    setDeleting(publicId);
    try {
      await deleteImage(publicId);
      setImages((prev) => {
        const next = prev.filter((image) => image.public_id !== publicId);
        const nextPageCount = Math.max(1, Math.ceil(next.length / PAGE_SIZE));
        setPage((currentPage) => Math.min(currentPage, nextPageCount));
        return next;
      });
      setDeleteMsg("Image deleted.");
      setTimeout(() => setDeleteMsg(""), 3000);
    } catch {
      setDeleteMsg("Delete failed   please remove from Cloudinary dashboard.");
      setTimeout(() => setDeleteMsg(""), 5000);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Box
      sx={(t) => ({
        bgcolor: "background.paper",
        borderRadius: 3,
        p: { xs: 2.25, md: 3 },
        border: `1px solid ${alpha(t.palette.divider, 0.85)}`,
        boxShadow:
          t.palette.mode === "dark"
            ? "0 18px 50px rgba(0,0,0,0.45)"
            : "0 18px 50px rgba(15,23,42,0.08)",
      })}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
          mb: 2.25,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 950,
              letterSpacing: "-0.01em",
              fontSize: "1.05rem",
            }}
          >
            {sectionTitle}
          </Typography>
          <Typography
            sx={{ color: "text.secondary", fontSize: "0.9rem", mt: 0.25 }}
          >
            Manage your assets by folder and keep collections tidy.
          </Typography>
        </Box>

        {viewMode === "category" && (
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 260 } }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
            >
              {FOLDERS.map((category) => (
                <MenuItem
                  key={category.folder || ALL_CATEGORY_VALUE}
                  value={category.folder || ALL_CATEGORY_VALUE}
                >
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {deleteMsg && (
        <Alert
          severity={deleteMsg.includes("failed") ? "error" : "success"}
          sx={{ mb: 2 }}
        >
          {deleteMsg}
        </Alert>
      )}
      {loadMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadMsg}
        </Alert>
      )}

      {loading ? (
        <LinearProgress sx={{ borderRadius: 999 }} />
      ) : sortedImages.length === 0 ? (
        <Typography
          sx={{ color: "text.secondary", textAlign: "center", py: 4 }}
        >
          {searchQuery.trim()
            ? "No images match your search."
            : "No images in this folder yet."}
        </Typography>
      ) : (
        <>
          <Typography
            sx={{ color: "text.secondary", fontSize: "0.85rem", mb: 2 }}
          >
            Showing {(page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, sortedImages.length)} of{" "}
            {sortedImages.length} loaded asset
            {sortedImages.length !== 1 ? "s" : ""}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: 2.25,
            }}
          >
            {visibleImages.map((image) => (
              <Card
                key={image.public_id}
                variant="outlined"
                sx={(t) => ({
                  borderRadius: "16px",
                  overflow: "hidden",
                  borderColor: alpha(t.palette.divider, 0.85),
                  boxShadow:
                    t.palette.mode === "dark"
                      ? "0 14px 44px rgba(0,0,0,0.35)"
                      : "0 14px 44px rgba(15,23,42,0.10)",
                  transition:
                    "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: alpha(t.palette.primary.main, 0.28),
                    boxShadow:
                      t.palette.mode === "dark"
                        ? "0 18px 60px rgba(0,0,0,0.45)"
                        : "0 18px 60px rgba(15,23,42,0.14)",
                    "& .fis-img": { transform: "scale(1.05)" },
                  },
                })}
              >
                <CardMedia
                  component="img"
                  image={getThumbnailUrl(image.public_id)}
                  alt={image.display_name || image.public_id}
                  className="fis-img"
                  sx={{
                    height: 150,
                    objectFit: "cover",
                    transition: "transform 320ms ease",
                  }}
                />
                <CardActions
                  sx={{
                    p: 1.1,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.78rem",
                      color: "text.secondary",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                      fontWeight: 800,
                    }}
                  >
                    {image.display_name || image.public_id.split("/").pop()}
                  </Typography>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(image.public_id)}
                      disabled={deleting === image.public_id}
                      sx={(t) => ({
                        color: t.palette.error.main,
                        transition:
                          "transform 200ms ease, background-color 200ms ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          bgcolor: alpha(
                            t.palette.error.main,
                            t.palette.mode === "dark" ? 0.16 : 0.1,
                          ),
                        },
                      })}
                    >
                      {deleting === image.public_id ? (
                        <CircularProgress size={14} />
                      ) : (
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            ))}
          </Box>
          <Box
            sx={{
              mt: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Pagination
              page={page}
              count={Math.max(
                nextCursor ? totalLoadedPages + 1 : totalLoadedPages,
                page,
              )}
              color="primary"
              shape="rounded"
              onChange={async (_, value) => {
                await ensurePageLoaded(value);
                setPage(value);
              }}
            />
            <Typography sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
              {nextCursor
                ? "More images available."
                : "End of loaded collection."}
              {loadingMore ? " Loading next page..." : ""}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
