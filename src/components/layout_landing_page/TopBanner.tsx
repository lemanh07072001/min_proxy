import type { EmblaOptionsType } from 'embla-carousel';
import AutoScroll from 'embla-carousel-auto-scroll';
import useEmblaCarousel from 'embla-carousel-react';
import { Star } from 'lucide-react';
import React, { useEffect } from 'react';

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

export default function TopBanner(props: PropType) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      axis: 'x',
      ...props.options,
    },
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: false,
        speed: 0.3,
      }),
    ],
  );

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi]);

  return (
    <div className="embla bg-gradient-to-r from-red-600 via-red-500 to-orange-500">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex flex-row">
          {props.slides.map(index => (
            <div
              className="embla__slide flex-[0_0_100%]  px-4 py-3" // 100% chiều rộng => 1 item / trang
              key={index}
            >
              <div className="flex items-center  text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    <span className="font-semibold">🔥 HOT:</span>
                  </div>
                  <span>
                    Tuyển đại lý toàn quốc - Hoa hồng lên đến 40% - Hỗ trợ marketing 24/7
                  </span>
                </div>
                <button className="hidden ms-3 cursor-pointer items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 font-semibold transition-all duration-300 hover:scale-105 hover:bg-white/30 md:flex">
                  <Star className="h-4 w-4" />
                  Đăng ký ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
