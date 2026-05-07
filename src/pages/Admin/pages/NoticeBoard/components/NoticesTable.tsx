import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  NOTICE_CATEGORIES,
  NOTICE_STATUSES,
  formatNoticeDate,
  type Notice,
  type NoticeCategory,
  type NoticeStatus,
} from "../data";
import { getCategoryColors, getStatusColor } from "../categoryStyles";

type SortDirection = "asc" | "desc";

type NoticesTableProps = {
  notices: Notice[];
  pageSize?: number;
  searchQuery?: string;
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
  onPreview?: (notice: Notice) => void;
};

const DEFAULT_PAGE_SIZE = 4;

export function NoticesTable({
  notices,
  pageSize = DEFAULT_PAGE_SIZE,
  searchQuery = "",
  onEdit,
  onDelete,
  onPreview,
}: NoticesTableProps) {
  const isSmDown = useMediaQuery("(max-width:600px)");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [categoryFilter, setCategoryFilter] = useState<NoticeCategory[]>([]);
  const [statusFilter, setStatusFilter] = useState<NoticeStatus[]>([]);
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [page, setPage] = useState(1);

  const filteredNotices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notices.filter((notice) => {
      if (q) {
        const haystack = `${notice.title} ${notice.description} ${notice.category}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (categoryFilter.length > 0 && !categoryFilter.includes(notice.category)) {
        return false;
      }
      if (statusFilter.length > 0 && !statusFilter.includes(notice.status)) {
        return false;
      }
      return true;
    });
  }, [notices, searchQuery, categoryFilter, statusFilter]);

  const sortedNotices = useMemo(() => {
    const list = [...filteredNotices];
    list.sort((a, b) => {
      const diff = new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
      return sortDirection === "asc" ? diff : -diff;
    });
    return list;
  }, [filteredNotices, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedNotices.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleNotices = sortedNotices.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const activeFilterCount = categoryFilter.length + statusFilter.length;

  const handleCategoryChange = (event: SelectChangeEvent<NoticeCategory[]>) => {
    const value = event.target.value;
    setCategoryFilter(typeof value === "string" ? (value.split(",") as NoticeCategory[]) : value);
    setPage(1);
  };

  const handleStatusChange = (event: SelectChangeEvent<NoticeStatus[]>) => {
    const value = event.target.value;
    setStatusFilter(typeof value === "string" ? (value.split(",") as NoticeStatus[]) : value);
    setPage(1);
  };

  const clearFilters = () => {
    setCategoryFilter([]);
    setStatusFilter([]);
    setPage(1);
  };

  const showingStart = sortedNotices.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const showingEnd = Math.min(safePage * pageSize, sortedNotices.length);

  return (
    <Card
      variant="outlined"
      sx={(t) => ({
        borderRadius: 3,
        borderColor: alpha(t.palette.divider, 0.85),
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
          p: { xs: 2, md: 2.5 },
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 950, letterSpacing: "-0.01em", fontSize: "1.05rem" }}>
            Current Notices
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", mt: 0.25 }}>
            All notices across categories and publish states.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterAltOutlinedIcon fontSize="small" />}
            onClick={(event) => setFilterAnchor(event.currentTarget)}
            sx={(t) => ({
              borderRadius: 999,
              borderColor: alpha(t.palette.divider, 0.9),
              fontWeight: 700,
            })}
          >
            Filter{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SwapVertIcon fontSize="small" />}
            onClick={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}
            sx={(t) => ({
              borderRadius: 999,
              borderColor: alpha(t.palette.divider, 0.9),
              fontWeight: 700,
            })}
          >
            Sort by Date {sortDirection === "asc" ? "↑" : "↓"}
          </Button>
        </Stack>
      </Box>

      <Divider />

      {sortedNotices.length === 0 ? (
        <Box sx={{ p: { xs: 4, md: 6 }, textAlign: "center" }}>
          <Typography sx={{ color: "text.secondary" }}>
            No notices match your current filters.
          </Typography>
          {(activeFilterCount > 0 || searchQuery) && (
            <Button onClick={clearFilters} size="small" sx={{ mt: 1.5 }}>
              Clear filters
            </Button>
          )}
        </Box>
      ) : isSmDown ? (
        <Stack spacing={1.25} sx={{ p: 2 }}>
          {visibleNotices.map((notice) => (
            <NoticeMobileRow
              key={notice.id}
              notice={notice}
              onEdit={onEdit}
              onDelete={onDelete}
              onPreview={onPreview}
            />
          ))}
        </Stack>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ bgcolor: "transparent" }}>
          <Table sx={{ minWidth: 720 }} size="medium">
            <TableHead>
              <TableRow
                sx={(t) => ({
                  "& th": {
                    fontWeight: 800,
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: t.palette.text.secondary,
                    bgcolor: alpha(
                      t.palette.background.default,
                      t.palette.mode === "dark" ? 0.5 : 0.6,
                    ),
                  },
                })}
              >
                <TableCell>Notice Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date Posted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleNotices.map((notice) => (
                <NoticeTableRow
                  key={notice.id}
                  notice={notice}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onPreview={onPreview}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Divider />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 1.5,
          p: { xs: 2, md: 2.5 },
        }}
      >
        <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
          Showing {showingStart === 0 ? 0 : `${showingStart}-${showingEnd}`} of {notices.length} notice
          {notices.length === 1 ? "" : "s"}
          {sortedNotices.length !== notices.length
            ? ` · ${sortedNotices.length} match filters`
            : ""}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: "space-between", sm: "flex-end" } }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            sx={{ borderRadius: 999, fontWeight: 700, minWidth: 96 }}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            sx={{ borderRadius: 999, fontWeight: 700, minWidth: 96 }}
          >
            Next
          </Button>
        </Stack>
      </Box>

      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              borderRadius: 2.5,
              minWidth: 280,
            },
          },
        }}
      >
        <Typography sx={{ fontWeight: 800, fontSize: 12, mb: 1, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Filters
        </Typography>
        <FormControl size="small" sx={{ width: "100%", mb: 1.5 }}>
          <InputLabel>Category</InputLabel>
          <Select
            multiple
            value={categoryFilter}
            onChange={handleCategoryChange}
            input={<OutlinedInput label="Category" />}
            renderValue={(selected) => (selected as NoticeCategory[]).join(", ") || "Any"}
          >
            {NOTICE_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                <Checkbox checked={categoryFilter.includes(category)} size="small" />
                <ListItemText primary={category} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ width: "100%", mb: 1 }}>
          <InputLabel>Status</InputLabel>
          <Select
            multiple
            value={statusFilter}
            onChange={handleStatusChange}
            input={<OutlinedInput label="Status" />}
            renderValue={(selected) =>
              (selected as NoticeStatus[]).map((s) => s[0].toUpperCase() + s.slice(1)).join(", ") || "Any"
            }
          >
            {NOTICE_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                <Checkbox checked={statusFilter.includes(status)} size="small" />
                <ListItemText primary={status[0].toUpperCase() + status.slice(1)} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Button size="small" onClick={clearFilters} disabled={activeFilterCount === 0}>
            Clear
          </Button>
          <Button size="small" variant="contained" onClick={() => setFilterAnchor(null)}>
            Done
          </Button>
        </Box>
      </Menu>
    </Card>
  );
}

type NoticeRowProps = {
  notice: Notice;
  onEdit: (notice: Notice) => void;
  onDelete: (notice: Notice) => void;
  onPreview?: (notice: Notice) => void;
};

function NoticeTableRow({ notice, onEdit, onDelete, onPreview }: NoticeRowProps) {
  return (
    <TableRow
      hover
      sx={(t) => ({
        "& td": { borderColor: alpha(t.palette.divider, 0.8) },
        "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.04) },
      })}
    >
      <TableCell sx={{ maxWidth: 360 }}>
        <Typography sx={{ fontWeight: 800, lineHeight: 1.25 }}>{notice.title}</Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 12.5,
            mt: 0.25,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {notice.description}
        </Typography>
      </TableCell>
      <TableCell>
        <CategoryBadge category={notice.category} />
      </TableCell>
      <TableCell sx={{ whiteSpace: "nowrap", color: "text.secondary", fontSize: 13.5 }}>
        {formatNoticeDate(notice.postedAt)}
      </TableCell>
      <TableCell>
        <StatusIndicator status={notice.status} />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: "flex-end" }}>
          {onPreview && (
            <Tooltip title="Preview">
              <IconButton size="small" onClick={() => onPreview(notice)} aria-label="Preview notice">
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit(notice)}
              aria-label="Edit notice"
              sx={(t) => ({
                color: t.palette.primary.main,
                "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.10) },
              })}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete(notice)}
              aria-label="Delete notice"
              sx={(t) => ({
                color: t.palette.error.main,
                "&:hover": { bgcolor: alpha(t.palette.error.main, 0.10) },
              })}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

function NoticeMobileRow({ notice, onEdit, onDelete, onPreview }: NoticeRowProps) {
  return (
    <Box
      sx={(t) => ({
        p: 1.75,
        border: `1px solid ${alpha(t.palette.divider, 0.85)}`,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      })}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 800, lineHeight: 1.25 }}>{notice.title}</Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 12.5,
              mt: 0.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {notice.description}
          </Typography>
        </Box>
        <StatusIndicator status={notice.status} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <CategoryBadge category={notice.category} />
          <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
            {formatNoticeDate(notice.postedAt)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.25}>
          {onPreview && (
            <IconButton size="small" onClick={() => onPreview(notice)} aria-label="Preview notice">
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => onEdit(notice)}
            aria-label="Edit notice"
            sx={(t) => ({ color: t.palette.primary.main })}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(notice)}
            aria-label="Delete notice"
            sx={(t) => ({ color: t.palette.error.main })}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}

function CategoryBadge({ category }: { category: NoticeCategory }) {
  return (
    <Chip
      size="small"
      label={category}
      sx={(t) => {
        const c = getCategoryColors(t, category);
        return {
          fontWeight: 800,
          height: 24,
          bgcolor: c.bg,
          color: c.fg,
          border: `1px solid ${c.border}`,
        };
      }}
    />
  );
}

function StatusIndicator({ status }: { status: NoticeStatus }) {
  const label = status === "published" ? "Published" : "Draft";
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
      <Box
        sx={(t) => ({
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: getStatusColor(t, status),
          boxShadow: `0 0 0 3px ${alpha(getStatusColor(t, status), 0.18)}`,
        })}
      />
      <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>{label}</Typography>
    </Box>
  );
}
