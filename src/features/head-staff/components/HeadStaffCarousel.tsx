import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { Box, Typography } from "@mui/material";

import type { HeadStaffMember } from "../types/headStaff.types";
import { HeadStaffCard } from "./HeadStaffCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  staff: HeadStaffMember[];
};

export function HeadStaffCarousel({ staff }: Props) {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 5 },
        py: 6,

        "& .swiper": {
          paddingBottom: 6,
        },

        "& .swiper-slide": {
          display: "flex",
          height: "auto",
        },

        "& .swiper-button-prev, & .swiper-button-next": {
          color: "primary.main",
          transform: "scale(1.1)",
        },

        "& .swiper-pagination-bullet-active": {
          backgroundColor: "primary.main",
        },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          textAlign: "center",
          mb: 5,
        }}
      >
        Our Leadership Team
      </Typography>

      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          // 📱 mobile
          0: {
            slidesPerView: 1.1,
            spaceBetween: 18,
          },

          // 📱 large mobile / small tablet
          640: {
            slidesPerView: 2,
            spaceBetween: 24,
          },

          // 💻 tablet / small laptop
          900: {
            slidesPerView: 3,
            spaceBetween: 28,
          },

          // 🖥️ laptop (your target)
          1200: {
            slidesPerView: 3.3, // 👈 key trick for “left-mid-right feel”
            spaceBetween: 32,
          },

          // 🖥️ large screens
          1500: {
            slidesPerView: 4,
            spaceBetween: 36,
          },
        }}
      >
        {staff.map((member) => (
          <SwiperSlide key={member.id}>
            <Box sx={{ px: 1 }}>
              <HeadStaffCard member={member} />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
