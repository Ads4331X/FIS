import { Box } from "@mui/material";

export function StatCard({
  value,
  label,
  variant = "legacy",
}: {
  value: React.ReactNode;
  label: string;
  variant?: "legacy" | "pass" | "eca";
}) {
  const styles = {
    legacy: {
      bg: "#0D4A86",
      text: "#ffffff",
      label: "#bfdbfe",
    },
    pass: {
      bg: "#FFB3AC",
      text: "#ffffff",
      label: "#FFEDEB",
    },
    eca: {
      bg: "#38873A",
      text: "#ffffff",
      label: "#C8FFBF",
    },
  };

  const s = styles[variant];

  return (
    <Box
      sx={{
        flex: "1 1 250px",
        backgroundColor: s.bg,
        color: s.text,
        p: 4,
        borderRadius: 3,
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-6px)",
        },
      }}
    >
      <Box sx={{ fontSize: "3rem", fontWeight: 800 }}>{value}</Box>

      <Box
        sx={{
          fontSize: "0.875rem",
          fontWeight: 500,
          mt: 1,
          color: s.label,
        }}
      >
        {label}
      </Box>
    </Box>
  );
}
