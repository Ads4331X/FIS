import { useState } from "react";
import type { ReactNode } from "react";
import { Box, Button } from "@mui/material";

type CarouselProps<T> = {
  items: T[];
  renderSlide: (item: T) => ReactNode;
  label?: string;
  sx?: Record<string, unknown>;
};

export function Carousel<T>({
  items,
  renderSlide,
  label,
  sx,
}: CarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = items.length;

  if (count === 0) {
    return null;
  }

  const move = (value: number) => {
    setActiveIndex((current) => (current + count + value) % count);
  };

  return (
    <Box sx={{ position: "relative", width: "100%", ...sx }}>
      <Box sx={{ overflow: "hidden", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            width: `${count * 100}%`,
            transition: "transform 0.45s ease",
            transform: `translateX(-${activeIndex * (100 / count)}%)`,
          }}
        >
          {items.map((item, index) => (
            <Box
              key={label ? `${label}-${index}` : index}
              sx={{ flex: "0 0 100%", width: "100%", px: { xs: 0, sm: 1 } }}
            >
              {renderSlide(item)}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Button
          size="small"
          onClick={() => move(-1)}
          sx={{ minWidth: 94, fontWeight: 700, color: "#074783" }}
        >
          Previous
        </Button>

        <Box
          sx={{ display: "flex", gap: 1, justifyContent: "center", flex: 1 }}
        >
          {items.map((_, index) => (
            <Box
              key={index}
              onClick={() => setActiveIndex(index)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: index === activeIndex ? "#074783" : "#CBD5E1",
                cursor: "pointer",
              }}
            />
          ))}
        </Box>

        <Button
          size="small"
          onClick={() => move(1)}
          sx={{ minWidth: 94, fontWeight: 700, color: "#074783" }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
