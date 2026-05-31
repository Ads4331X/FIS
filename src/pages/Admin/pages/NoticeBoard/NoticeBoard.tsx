import { useEffect, useMemo, useState } from "react";
import { Box, Button, Snackbar, Alert, Typography, alpha, useMediaQuery } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { AdminPageHeader } from "../../components/AdminPageHeader";
import { findAdminSection } from "../../config/sections";
import { NoticeStats } from "./components/NoticeStats";
import type { NoticeStatFilter } from "./components/NoticeStats";
import { NoticesTable } from "./components/NoticesTable";
import { NoticePreview } from "./components/NoticePreview";
import { SystemActivity } from "./components/SystemActivity";
import { NoticeFormDialog } from "./components/NoticeFormDialog";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { NoticeDetailDialog } from "./components/NoticeDetailDialog";
import { ActivityLogDialog } from "./components/ActivityLogDialog";
import { deleteImage, fetchNotices } from "../../../../services/Cloudinary";
import {
  appendActivity,
  generateNoticeId,
  loadActivity,
  NOTICE_CATEGORIES,
  saveActivity,
  type Notice,
  type NoticeActivity,
} from "./data";
import type { NoticeItem } from "../../../../services/Cloudinary";

type Toast = {
  message: string;
  severity: "success" | "info" | "warning" | "error";
};

export default function NoticeBoard() {
  const { searchQuery, setSearchQuery } = useOutletContext<{
    searchQuery: string;
    setSearchQuery: (value: string) => void;
  }>();
  const section = findAdminSection("/admin/noticeboard");
  const isMdUp = useMediaQuery("(min-width:900px)");

  const [notices, setNotices] = useState<Notice[]>([]);
  const [activity, setActivity] = useState<NoticeActivity[]>(() => loadActivity());
  const [formOpen, setFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deletingNotice, setDeletingNotice] = useState<Notice | null>(null);
  const [isDeletingNotice, setIsDeletingNotice] = useState(false);
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);
  const [detailNotice, setDetailNotice] = useState<Notice | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [statsFilter, setStatsFilter] = useState<NoticeStatFilter>("all");

  useEffect(() => {
    saveActivity(activity);
  }, [activity]);

  useEffect(() => {
    let active = true;

    const loadCloudNotices = async () => {
      try {
        const allCloudNotices: NoticeItem[] = [];
        let cursor: string | undefined;
        do {
          const { notices: cloudNotices, nextCursor } = await fetchNotices(cursor);
          allCloudNotices.push(...cloudNotices);
          cursor = nextCursor ?? undefined;
        } while (cursor);

        if (!active) return;

        setNotices((prev) => {
          const drafts = prev.filter((notice) => notice.status === "draft");
          const publishedFromCloud: Notice[] = allCloudNotices.map((notice) => ({
            category: NOTICE_CATEGORIES.includes(notice.category as Notice["category"])
              ? (notice.category as Notice["category"])
              : "General",
            id: notice.id,
            cloudinaryId: notice.id,
            title: notice.title,
            description: notice.description ?? "",
            status: "published",
            postedAt: notice.createdAt,
            imageUrl: notice.imageUrl,
            resourceType: notice.resourceType,
          }));
          return [...drafts, ...publishedFromCloud];
        });
      } catch {
        // Keep local notices if cloud fetch fails.
      }
    };

    loadCloudNotices();
    return () => {
      active = false;
    };
  }, []);

  const featuredNotice = useMemo(() => {
    const candidate = previewNotice
      ? notices.find((n) => n.id === previewNotice.id) ?? previewNotice
      : null;
    if (candidate) return candidate;
    const published = [...notices]
      .filter((n) => n.status === "published")
      .sort(
        (a, b) =>
          new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
      );
    if (published.length > 0) return published[0];
    return notices[0] ?? null;
  }, [notices, previewNotice]);

  const handleOpenCreate = () => {
    setEditingNotice(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormOpen(true);
  };

  const handleSave = (
    payload: Omit<Notice, "id" | "postedAt"> & { id?: string; postedAt?: string },
  ) => {
    const existing = payload.id ? notices.find((n) => n.id === payload.id) : undefined;

    if (payload.id && existing) {
      const nextStatus = existing.status === "published" ? "published" : payload.status;
      const next: Notice = {
        id: payload.id,
        title: payload.title,
        description: payload.description,
        category: payload.category,
        status: nextStatus,
        postedAt: payload.postedAt ?? new Date().toISOString(),
        imageUrl: payload.imageUrl,
        // FIX: always carry cloudinaryId and resourceType forward
        cloudinaryId: payload.cloudinaryId ?? existing.cloudinaryId,
        resourceType: payload.resourceType ?? existing.resourceType,
      };
      setNotices((prev) => prev.map((notice) => (notice.id === next.id ? next : notice)));
      const isNewlyPublished =
        existing && existing.status !== "published" && next.status === "published";
      setActivity((prev) =>
        appendActivity(prev, {
          type: isNewlyPublished ? "published" : "updated",
          title: isNewlyPublished ? "Notice Published" : "Notice Updated",
          detail: `"${next.title}" was ${isNewlyPublished ? "published" : "updated"}`,
        }),
      );
      setToast({
        message: isNewlyPublished ? "Notice published." : "Notice updated.",
        severity: "success",
      });
    } else {
      const next: Notice = {
        // Local id for React state; cloudinaryId is the real Cloudinary public_id
        id: payload.id ?? generateNoticeId(),
        title: payload.title,
        description: payload.description,
        category: payload.category,
        status: payload.status,
        postedAt: new Date().toISOString(),
        imageUrl: payload.imageUrl,
        // FIX: save cloudinaryId and resourceType returned from upload
        cloudinaryId: payload.cloudinaryId,
        resourceType: payload.resourceType,
      };
      setNotices((prev) => [next, ...prev]);
      setActivity((prev) =>
        appendActivity(prev, {
          type: next.status === "published" ? "published" : "created",
          title: next.status === "published" ? "Notice Published" : "Draft Created",
          detail: `"${next.title}"`,
        }),
      );
      setToast({
        message:
          next.status === "published"
            ? "Notice published."
            : "Draft saved.",
        severity: "success",
      });
    }
    setFormOpen(false);
    setEditingNotice(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingNotice || isDeletingNotice) return;
    setIsDeletingNotice(true);
    const removed = deletingNotice;

    try {
      // FIX: use cloudinaryId (real Cloudinary public_id) not the local id.
      // Only call Cloudinary if this notice was actually uploaded there.
      if (removed.cloudinaryId) {
        const resourceType = removed.resourceType ?? "raw";
        try {
          await deleteImage(removed.cloudinaryId, resourceType);
        } catch (error) {
          setToast({
            message:
              error instanceof Error
                ? error.message
                : "Failed to delete notice from Cloudinary.",
            severity: "error",
          });
          return;
        }
      }

      setNotices((prev) => prev.filter((notice) => notice.id !== removed.id));
      setActivity((prev) =>
        appendActivity(prev, {
          type: "removed",
          title: removed.status === "draft" ? "Draft Removed" : "Notice Removed",
          detail: `"${removed.title}" was deleted`,
        }),
      );
      if (previewNotice?.id === removed.id) {
        setPreviewNotice(null);
      }
      if (detailNotice?.id === removed.id) {
        setDetailNotice(null);
      }
      setDeletingNotice(null);
      setToast({ message: "Notice deleted.", severity: "info" });
    } finally {
      setIsDeletingNotice(false);
    }
  };

  const handleClearActivity = () => {
    setActivity([]);
    setLogOpen(false);
    setToast({ message: "Activity log cleared.", severity: "info" });
  };

  return (
    <Box>
      <AdminPageHeader
        title="Notice Management"
        subtitle={
          <>
            <Typography
              component="span"
              sx={{ fontWeight: 800, color: "text.primary", display: "block", mb: 0.5 }}
            >
              Live Board Overview
            </Typography>
            {section.subtitle}
          </>
        }
        actions={
          <Button
            fullWidth={!isMdUp}
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={(t) => ({
              borderRadius: 2,
              fontWeight: 900,
              px: 2.25,
              boxShadow: `0 14px 40px ${alpha(
                t.palette.secondary.main,
                t.palette.mode === "dark" ? 0.32 : 0.22,
              )}`,
            })}
          >
            Post New Notice
          </Button>
        }
      />

      <NoticeStats
        notices={notices}
        activeFilter={statsFilter}
        onFilterChange={setStatsFilter}
      />

      <NoticesTable
        notices={notices}
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery("")}
        statsFilter={statsFilter}
        onEdit={handleOpenEdit}
        onDelete={setDeletingNotice}
      />

      <Box
        sx={{
          mt: { xs: 2.5, md: 3 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.5fr 1fr" },
          gap: { xs: 2, md: 2.5 },
          alignItems: "start",
        }}
      >
        <NoticePreview
          notice={featuredNotice}
          onReadMore={(notice) => setDetailNotice(notice)}
        />
        <SystemActivity activity={activity} onViewAll={() => setLogOpen(true)} />
      </Box>

      <NoticeFormDialog
        open={formOpen}
        notice={editingNotice}
        onClose={() => {
          setFormOpen(false);
          setEditingNotice(null);
        }}
        onSave={handleSave}
      />

      <DeleteConfirmDialog
        open={Boolean(deletingNotice)}
        noticeTitle={deletingNotice?.title ?? null}
        loading={isDeletingNotice}
        onCancel={() => {
          if (isDeletingNotice) return;
          setDeletingNotice(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <NoticeDetailDialog
        open={Boolean(detailNotice)}
        notice={detailNotice}
        onClose={() => setDetailNotice(null)}
        onEdit={(notice) => {
          setDetailNotice(null);
          handleOpenEdit(notice);
        }}
        onDelete={(notice) => {
          setDetailNotice(null);
          setDeletingNotice(notice);
        }}
      />

      <ActivityLogDialog
        open={logOpen}
        activity={activity}
        onClose={() => setLogOpen(false)}
        onClear={handleClearActivity}
      />

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {toast ? (
          <Alert
            severity={toast.severity}
            onClose={() => setToast(null)}
            variant="filled"
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}