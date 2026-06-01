import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Box, Button } from "@mui/material";

type CarouselProps<T> = {
  items: T[];
  renderSlide: (item: T) => ReactNode;
  label?: string;
  sx?: Record<string, unknown>;
  autoplay?: boolean;
  autoplayDelayMs?: number;
  pauseOnHover?: boolean;
  wrap?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
};

export function Carousel<T>({
  items,
  renderSlide,
  label,
  sx,
  autoplay = false,
  autoplayDelayMs = 5000,
  pauseOnHover = false,
  wrap = false,
  showArrows = true,
  showDots = true,
}: CarouselProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (!autoplay || count <= 1) return undefined;
    if (isPaused) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        const next = current + 1;
        if (next >= count) {
          return wrap ? 0 : current;
        }
        return next;
      });
    }, autoplayDelayMs);

    return () => window.clearInterval(timer);
  }, [autoplay, autoplayDelayMs, count, isPaused, wrap]);

  if (count === 0) {
    return null;
  }

  const move = (value: number) => {
    setActiveIndex((current) => {
      const next = current + value;
      if (wrap) {
        return (next + count) % count;
      }
      return Math.min(Math.max(next, 0), count - 1);
    });
  };

  return (
    <Box
      sx={{ position: "relative", width: "100%", ...sx }}
      onMouseEnter={() => {
        if (pauseOnHover) setIsPaused(true);
      }}
      onMouseLeave={() => {
        if (pauseOnHover) setIsPaused(false);
      }}
    >
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

      {(showArrows || showDots) && (
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
          {showArrows ? (
            <Button
              size="small"
              onClick={() => move(-1)}
              sx={{ minWidth: 94, fontWeight: 700, color: "#074783" }}
              disabled={!wrap && activeIndex === 0}
            >
              Previous
            </Button>
          ) : (
            <Box />
          )}

          {showDots ? (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
                flex: 1,
              }}
            >
              {items.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor:
                      index === activeIndex ? "#074783" : "#CBD5E1",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ flex: 1 }} />
          )}

          {showArrows ? (
            <Button
              size="small"
              onClick={() => move(1)}
              sx={{ minWidth: 94, fontWeight: 700, color: "#074783" }}
              disabled={!wrap && activeIndex === count - 1}
            >
              Next
            </Button>
          ) : (
            <Box />
          )}
        </Box>
      )}
    </Box>
  );
}
