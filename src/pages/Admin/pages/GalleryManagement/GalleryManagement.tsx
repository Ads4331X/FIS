import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Tab,
  Tabs,
  alpha,
  useMediaQuery,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AddIcon from "@mui/icons-material/Add";
import { AdminPageHeader } from "../../components/AdminPageHeader";
import { AdminStatCard } from "../../components/AdminStatCard";
import { findAdminSection } from "../../config/sections";
import { ImageManager, type AdminGalleryStats, type AdminGalleryView } from "./components/ImageManager";
import { UploadZone } from "./components/UploadZone";
import { useOutletContext } from "react-router-dom";

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 MB";
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

const TAB_VIEWS: { label: string; view: AdminGalleryView }[] = [
  { label: "All", view: "all" },
  { label: "By Category", view: "category" },
];

export default function GalleryManagement() {
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const section = findAdminSection("/admin/gallerymanagement");
  const isMdUp = useMediaQuery("(min-width:900px)");
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState<AdminGalleryStats>({
    loadedAssets: 0,
    loadedBytes: 0,
    hasMore: false,
  });

  const activeView = TAB_VIEWS[tab]?.view ?? "all";

  return (
    <Box>
      <AdminPageHeader
        title={section.label}
        subtitle={section.subtitle}
        actions={
          <>
            <Button
              fullWidth={!isMdUp}
              variant="outlined"
              startIcon={<FilterAltOutlinedIcon />}
              sx={(t) => ({
                borderColor: alpha(t.palette.divider, 0.9),
                bgcolor: alpha(
                  t.palette.background.paper,
                  t.palette.mode === "dark" ? 0.45 : 0.65,
                ),
                "&:hover": {
                  bgcolor: alpha(t.palette.background.paper, 0.9),
                },
              })}
            >
              Filter
            </Button>
            <Button
              fullWidth={!isMdUp}
              variant="contained"
              startIcon={<AddIcon />}
              sx={(t) => ({
                borderRadius: 2,
                boxShadow: `0 14px 40px ${alpha(
                  t.palette.primary.main,
                  t.palette.mode === "dark" ? 0.22 : 0.18,
                )}`,
              })}
            >
              New Collection
            </Button>
          </>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.45fr 0.55fr" },
          gap: 2.25,
          alignItems: "start",
        }}
      >
        <Box>
          <UploadZone onUploaded={() => setRefreshKey((k) => k + 1)} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
          <AdminStatCard
            title="Storage used"
            value={formatBytes(stats.loadedBytes)}
            subtitle={
              stats.hasMore
                ? "From currently loaded images (more available)"
                : "From currently loaded images"
            }
            accent="info"
          />
          <AdminStatCard
            title="Total assets"
            value={String(stats.loadedAssets)}
            subtitle={
              stats.hasMore
                ? "Loaded so far (next pages available)"
                : "Loaded in current view"
            }
            accent="primary"
          />
        </Box>
      </Box>

      <Box sx={{ mt: { xs: 2.25, md: 3 } }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={(t) => ({
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${t.palette.primary.main}, ${alpha(
                t.palette.primary.main,
                0.55,
              )})`,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 800,
              minHeight: 42,
              px: 1.5,
            },
          })}
        >
          {TAB_VIEWS.map((item) => (
            <Tab key={item.view} label={item.label} />
          ))}
        </Tabs>
        <Divider sx={{ mt: 1.25, mb: { xs: 2, md: 2.5 } }} />

        <ImageManager
          refreshKey={refreshKey}
          viewMode={activeView}
          searchQuery={searchQuery}
          onStatsChange={setStats}
        />
      </Box>
    </Box>
  );
}
