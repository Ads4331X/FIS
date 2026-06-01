import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules";
import type { HeadStaffMember } from "../types/headStaff.types";
import { HeadStaffCard } from "./HeadStaffCard";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type HeadStaffCarouselProps = {
  staff: HeadStaffMember[];
};

export function HeadStaffCarousel({ staff }: HeadStaffCarouselProps) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, A11y]}
      slidesPerView={1}
      loop
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 4500,
        pauseOnMouseEnter: true,
        disableOnInteraction: false,
      }}
      style={{ padding: "1rem 0" }}
    >
      {staff.map((member) => (
        <SwiperSlide key={member.id}>
          <HeadStaffCard member={member} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
