import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import { Box } from "@mui/material";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import imageSliders from "../data/imageSlider.json";

export default function Home() {
  return (
    <Box
      sx={{
        margin: 0,
        padding: 0,
        overflow: "hidden",
        width: "100%",
        background:
          "linear-gradient(rgba(13, 42, 110, 0.75),rgba(13, 42, 110, 0.85))",
      }}
    >
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        observer={true}
        observeParents={true}
        resizeObserver={true}
        style={{
          width: "100%",
        }}
      >
        {imageSliders.map((image, key) => (
          <SwiperSlide key={key}>
            <img
              src={image}
              style={{
                width: "100%",
                height: "auto",
                display: "block", 
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
