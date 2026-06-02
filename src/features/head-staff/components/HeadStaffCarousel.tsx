import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { Box } from "@mui/material";

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
        width: "100%",
        position: "relative",
        px: { xs: 0, md: 5 },

        "& .swiper": {
          paddingBottom: 5,
          overflow: "hidden",
        },

        "& .swiper-slide": {
          height: "auto",
          display: "flex",
          justifyContent: "center",
          padding: "0 8px",
          boxSizing: "border-box",
        },

        "& .swiper-button-prev, & .swiper-button-next": {
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          color: "text.primary",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transition: "all 0.2s ease",
          zIndex: 2,

          "&::after": {
            fontSize: 15,
            fontWeight: 700,
          },

          "&:hover": {
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            borderColor: "primary.main",
          },

          "&.swiper-button-disabled": {
            opacity: 0.35,
            pointerEvents: "none",
          },

          // Hide on very small screens if needed, but keep for now
          display: { xs: "none", sm: "flex" },
        },

        "& .swiper-button-prev": {
          left: { xs: 0, sm: 4, md: -12, lg: -20 },
        },

        "& .swiper-button-next": {
          right: { xs: 0, sm: 4, md: -12, lg: -20 },
        },

        "& .swiper-pagination": {
          bottom: 0,
        },

        "& .swiper-pagination-bullet": {
          width: 8,
          height: 8,
          transition: "all 0.25s ease",
          opacity: 0.4,
        },

        "& .swiper-pagination-bullet-active": {
          backgroundColor: "primary.main",
          width: 22,
          borderRadius: 4,
          opacity: 1,
        },
      }}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        centeredSlides
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1.05,
            spaceBetween: 16,
          },
          640: {
            slidesPerView: 1.8,
            spaceBetween: 20,
          },
          900: {
            slidesPerView: 2.4,
            spaceBetween: 28,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        }}
      >
        {staff.map((member) => (
          <SwiperSlide key={member.id}>
            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: "100%", md: 360 },
                mx: "auto",
              }}
            >
              <HeadStaffCard member={member} />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
