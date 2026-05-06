import { Chip, Stack } from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import { CATEGORIES } from "../../../services/Cloudinary";

type CategoryFilterProps = {
  activeCategory: string;
  onSelect: (folder: string) => void;
};

export function CategoryFilter({ activeCategory, onSelect }: CategoryFilterProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ mb: 4, gap: 1, justifyContent: "center", flexWrap: "wrap" }}
    >
      {CATEGORIES.map((category) => (
        <Chip
          key={category.folder}
          label={category.label}
          onClick={() => onSelect(category.folder)}
          icon={category.folder === "" ? <CollectionsIcon /> : undefined}
          sx={{
            px: 1.2,
            py: 0.4,
            fontWeight: 700,
            fontSize: "0.85rem",
            bgcolor: activeCategory === category.folder ? "#0b2f5b" : "#f1f5f9",
            color: activeCategory === category.folder ? "white" : "#0f172a",
            border: "1px solid",
            borderColor: activeCategory === category.folder ? "#0b2f5b" : "#e2e8f0",
            boxShadow: activeCategory === category.folder ? "0 10px 26px rgba(11,47,91,0.25)" : "none",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: activeCategory === category.folder ? "#0b2f5b" : "#eaeef5",
            },
            "& .MuiChip-icon": {
              color: activeCategory === category.folder ? "white" : "#374151",
            },
          }}
        />
      ))}
    </Stack>
  );
}
