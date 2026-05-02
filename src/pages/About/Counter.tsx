import { useRef, useEffect } from "react";
import { CountUp } from "countup.js";
import { Box } from "@mui/material";
import { StatCard } from "../../component/StatCard";

export function Counter() {
  const ref = useRef<HTMLDivElement | null>(null);

  const r1 = useRef<HTMLSpanElement | null>(null);
  const r2 = useRef<HTMLSpanElement | null>(null);
  const r3 = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (r1.current) {
          new CountUp(r1.current, 15, { suffix: "+" }).start();
        }

        if (r2.current) {
          new CountUp(r2.current, 100, { suffix: "%" }).start();
        }

        if (r3.current) {
          new CountUp(r3.current, 25, { suffix: "+" }).start();
        }

        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 4,
        py: 6,
      }}
    >
      <StatCard
        variant="legacy"
        label="Years of Legacy"
        value={<Box ref={r1}>0</Box>}
      />

      <StatCard
        variant="pass"
        label="Board Pass Rate"
        value={<Box ref={r2}>0</Box>}
      />

      <StatCard
        variant="eca"
        label="ECA Activities"
        value={<Box ref={r3}>0</Box>}
      />
    </Box>
  );
}
