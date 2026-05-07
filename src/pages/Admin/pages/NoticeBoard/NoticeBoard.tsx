import { useEffect, useMemo, useState } from "react";
import { Box, Button, Snackbar, Alert, Typography, alpha, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AdminPageHeader } from "../../components/AdminPageHeader";
import { findAdminSection } from "../../config/sections";
import { NoticeStats } from "./components/NoticeStats";
import { NoticesTable } from "./components/NoticesTable";
import { NoticePreview } from "./components/NoticePreview";
import { SystemActivity } from "./components/SystemActivity";
import { NoticeFormDialog } from "./components/NoticeFormDialog";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { NoticeDetailDialog } from "./components/NoticeDetailDialog";
import { ActivityLogDialog } from "./components/ActivityLogDialog";
import {
  appendActivity,
  generateNoticeId,
  loadActivity,
  loadNotices,
  saveActivity,
  saveNotices,
  type Notice,
  type NoticeActivity,
} from "./data";

type Toast = {
  message: string;
  severity: "success" | "info" | "warning" | "error";
};

export default function NoticeBoard() {
  const section = findAdminSection("/admin/noticeboard");
  const isMdUp = useMediaQuery("(min-width:900px)");

  const [notices, setNotices] = useState<Notice[]>(() => loadNotices());
  const [activity, setActivity] = useState<NoticeActivity[]>(() => loadActivity());
  const [formOpen, setFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [deletingNotice, setDeletingNotice] = useState<Notice | null>(null);
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);
  const [detailNotice, setDetailNotice] = useState<Notice | null>(null);
  const [logOpen, setLogOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    saveNotices(notices);
  }, [notices]);

  useEffect(() => {
    saveActivity(activity);
  }, [activity]);

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
    if (payload.id) {
      const existing = notices.find((n) => n.id === payload.id);
      const next: Notice = {
        id: payload.id,
        title: payload.title,
        description: payload.description,
        category: payload.category,
        status: payload.status,
        postedAt: payload.postedAt ?? new Date().toISOString(),
        imageUrl: payload.imageUrl,
      };
      setNotices((prev) => prev.map((notice) => (notice.id === next.id ? next : notice)));
      const isNewlyPublished =
        existing && existing.status !== "published" && next.status === "published";
      setActivity((prev) =>
        appendActivity(prev, {
          type: isNewlyPublished ? "published" : "updated",
          title: isNewlyPublished ? "Notice Published" : "Notice Updated",
          detail: `“${next.title}” was ${isNewlyPublished ? "published" : "updated"}`,
        }),
      );
      setToast({
        message: isNewlyPublished ? "Notice published." : "Notice updated.",
        severity: "success",
      });
    } else {
      const next: Notice = {
        id: generateNoticeId(),
        title: payload.title,
        description: payload.description,
        category: payload.category,
        status: payload.status,
        postedAt: new Date().toISOString(),
        imageUrl: payload.imageUrl,
      };
      setNotices((prev) => [next, ...prev]);
      setActivity((prev) =>
        appendActivity(prev, {
          type: next.status === "published" ? "published" : "created",
          title: next.status === "published" ? "Notice Published" : "Draft Created",
          detail: `“${next.title}”`,
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

  const handleConfirmDelete = () => {
    if (!deletingNotice) return;
    const removed = deletingNotice;
    setNotices((prev) => prev.filter((notice) => notice.id !== removed.id));
    setActivity((prev) =>
      appendActivity(prev, {
        type: "removed",
        title: removed.status === "draft" ? "Draft Removed" : "Notice Removed",
        detail: `“${removed.title}” was deleted`,
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
            <Typography component="span" sx={{ fontWeight: 800, color: "text.primary", display: "block", mb: 0.5 }}>
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

      <NoticeStats notices={notices} />

      <NoticesTable
        notices={notices}
        onEdit={handleOpenEdit}
        onDelete={setDeletingNotice}
        onPreview={setPreviewNotice}
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
        onCancel={() => setDeletingNotice(null)}
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
