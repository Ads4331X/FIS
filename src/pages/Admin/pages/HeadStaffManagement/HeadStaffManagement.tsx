import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useOutletContext } from "react-router-dom";
import { findAdminSection } from "../../config/sections";
import { AdminPageHeader } from "../../components/AdminPageHeader";
import {
  fetchHeadStaff,
  createHeadStaff,
  updateHeadStaff,
  deleteHeadStaff,
} from "../../../../features/head-staff/services/headStaffService";
import type { HeadStaffMember } from "../../../../features/head-staff/types/headStaff.types";

type ToastState = {
  message: string;
  severity: "success" | "error" | "info";
};

export default function HeadStaffManagement() {
  const section = findAdminSection("/admin/head-staff");
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [staff, setStaff] = useState<HeadStaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<HeadStaffMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [formState, setFormState] = useState({
    name: "",
    position: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    let active = true;

    const loadStaff = async () => {
      try {
        const list = await fetchHeadStaff();
        if (!active) return;
        setStaff(list);
      } catch (error) {
        if (!active) return;
        setToast({
          message:
            error instanceof Error
              ? error.message
              : "Unable to load head staff list.",
          severity: "error",
        });
      } finally {
        if (active) setLoading(false);
      }
    };

    loadStaff();
    return () => {
      active = false;
    };
  }, []);

  const filteredStaff = useMemo(
    () =>
      staff.filter((member) =>
        [member.name, member.position, member.description]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim()),
      ),
    [searchQuery, staff],
  );

  const openDialog = (member?: HeadStaffMember) => {
    setSelected(member ?? null);
    setFormState({
      name: member?.name ?? "",
      position: member?.position ?? "",
      description: member?.description ?? "",
      imageUrl: member?.imageUrl ?? "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelected(null);
  };

  const handleSave = async () => {
    if (!formState.name.trim() || !formState.position.trim()) {
      setToast({
        message: "Provide both a name and a position.",
        severity: "error",
      });
      return;
    }

    setSaving(true);
    try {
      if (selected) {
        const updated = await updateHeadStaff({
          id: selected.id,
          ...formState,
        });
        setStaff((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
        setToast({ message: "Staff member updated.", severity: "success" });
      } else {
        const created = await createHeadStaff(formState);
        setStaff((prev) => [created, ...prev]);
        setToast({ message: "Staff member added.", severity: "success" });
      }
      closeDialog();
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Failed to save staff member.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: HeadStaffMember) => {
    setSaving(true);
    try {
      await deleteHeadStaff(member.id);
      setStaff((prev) => prev.filter((item) => item.id !== member.id));
      setToast({ message: "Staff member removed.", severity: "success" });
    } catch (error) {
      setToast({
        message:
          error instanceof Error
            ? error.message
            : "Could not remove staff member.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <AdminPageHeader title={section.label} subtitle={section.subtitle} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mt: 4,
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Head Staff Showcase
        </Typography>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => openDialog()}
        >
          Add Staff Member
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {filteredStaff.map((member) => (
            <Box key={member.id}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #E2E8F0",
                  bgcolor: "background.paper",
                  minHeight: 220,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography sx={{ color: "#B91C1C", fontWeight: 700, mb: 1 }}>
                    {member.position}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
                    {member.name}
                  </Typography>
                  <Typography sx={{ color: "#475569", mt: 2 }}>
                    {member.description}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => openDialog(member)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(member)}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
          {filteredStaff.length === 0 && (
            <Box sx={{ gridColumn: "1 / -1" }}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 3,
                  bgcolor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
              >
                <Typography sx={{ color: "#475569" }}>
                  No head staff members found. Add the first record to fill the
                  showcase.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {selected ? "Edit staff member" : "Add staff member"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
          <TextField
            label="Full name"
            value={formState.name}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, name: event.target.value }))
            }
            fullWidth
            required
          />
          <TextField
            label="Position"
            value={formState.position}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                position: event.target.value,
              }))
            }
            fullWidth
            required
          />
          <TextField
            label="Short description"
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="Image URL"
            value={formState.imageUrl}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                imageUrl: event.target.value,
              }))
            }
            fullWidth
            helperText="Optional. Use a hosted image path or leave blank for placeholder."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeDialog} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} variant="contained">
            {selected ? "Save changes" : "Add staff"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
      >
        {toast ? (
          <Alert
            severity={toast.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
