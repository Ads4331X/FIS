import { Container, Box, Typography } from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";

const primary = "#074783";
const red = "#c0392b";

function Dot({
  icon,
  filled = false,
  color = primary,
}: {
  icon: React.ReactNode;
  filled?: boolean;
  color?: string;
}) {
  return (
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        border: filled ? "none" : `2.5px solid ${color}`,
        bgcolor: filled ? color : "#fff",
        color: filled ? "#fff" : color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        zIndex: 1,
        position: "relative",
        background: filled ? color : "#fff",
      }}
    >
      {icon}
    </Box>
  );
}

const LabelText = ({ children }: { children: string }) => (
  <Typography
    sx={{
      fontWeight: 700,
      letterSpacing: "0.12em",
      fontSize: { xs: "0.65rem", md: "0.72rem" },
      textTransform: "uppercase",
      color: primary,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </Typography>
);

const Title = ({ children }: { children: string }) => (
  <Typography
    sx={{
      fontWeight: 700,
      color: primary,
      fontSize: { xs: "1rem", md: "1.15rem" },
      lineHeight: 1.3,
    }}
  >
    {children}
  </Typography>
);

const Desc = ({ children }: { children: string }) => (
  <Typography
    sx={{
      color: "#555",
      fontSize: { xs: "0.85rem", md: "0.93rem" },
      lineHeight: 1.75,
      mt: 0.75,
    }}
  >
    {children}
  </Typography>
);

const items = [
  {
    first: true,
    left: (
      <Box sx={{ textAlign: "right" }}>
        <Title>Early Foundation</Title>
        <Desc>
          Montessori-inspired learning in Nursery and KG, with practical life
          exercises, sensorial play, and discovery activities that support the
          young learner's absorbent mind.
        </Desc>
      </Box>
    ),
    dot: <Dot icon={<EmojiEmotionsOutlinedIcon fontSize="small" />} />,
    right: <LabelText>Nursery – KG</LabelText>,
  },
  {
    right: (
      <Box>
        <LabelText>Class 1 – 5</LabelText>
      </Box>
    ),
    dot: <Dot icon={<MenuBookOutlinedIcon fontSize="small" />} filled />,
    left: (
      <Box sx={{ textAlign: "right" }}>
        <Title>Primary Exploration</Title>
        <Desc>
          Thematic, activity-rich learning for Classes 1–5 that strengthens
          literacy, numeracy, science, and social confidence through inquiry and
          collaboration.
        </Desc>
      </Box>
    ),
  },
  {
    left: (
      <Box sx={{ textAlign: "right" }}>
        <Title>Secondary Excellence</Title>
        <Desc>
          Classes 6–10 focus on academic depth, practical inquiry, and
          co-curricular balance to develop confident learners and responsible
          citizens.
        </Desc>
      </Box>
    ),
    dot: <Dot icon={<SchoolOutlinedIcon fontSize="small" />} color={red} />,
    right: <LabelText>Class 6 – 10</LabelText>,
    last: true,
  },
];

export function EducationalJourney() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
      {/* heading */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Box
          component="h1"
          sx={{
            fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
            fontWeight: 800,
            color: primary,
            m: 0,
          }}
        >
          The Educational Journey
        </Box>
        <Typography
          sx={{
            color: "#666",
            mt: 1.5,
            fontSize: { xs: "0.9rem", md: "1rem" },
            lineHeight: 1.7,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          From the first steps of curiosity to the final stride towards
          graduation, we walk with our students every step of the way.
        </Typography>
      </Box>

      {/* timeline */}
      <Box
        sx={{
          maxWidth: { xs: "100%", md: 860 },
          mx: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {items.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "40px 1fr", md: "1fr 52px 1fr" },
              gap: { xs: 1.5, md: 3 },
            }}
          >
            {/* LEFT  hidden on mobile */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-end",
                alignItems: "flex-start",
                pt: "14px",
                paddingRight: "14px",
              }}
            >
              {item.left}
            </Box>

            {/* CENTER dot + continuous dashed line */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Top tail on first item, gap on others */}
              <Box
                sx={{
                  height: item.first ? 40 : 24,
                  width: 0,
                  borderLeft: `2px dashed ${primary}`,
                  opacity: 0.4,
                }}
              />

              {/* The dot */}
              {item.dot}

              {/* Bottom dashed line after dot (including last item tail) */}
              <Box
                sx={{
                  flex: item.last ? "none" : 1,
                  height: item.last ? 40 : undefined,
                  width: 0,
                  borderLeft: `2px dashed ${primary}`,
                  opacity: 0.4,
                  mt: 0,
                }}
              />
            </Box>

            {/* RIGHT */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "14px",
                pb: { xs: 3, md: 4 },
              }}
            >
              {/* On mobile show left content stacked above right */}
              <Box sx={{ width: "100%" }}>
                <Box sx={{ display: { xs: "block", md: "none" }, mb: 0.5 }}>
                  {item.left}
                </Box>
                {item.right}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
