"use client";

import { CarouselContainer } from "@/components/image-carousel/carousel-container";
import { CarouselImage } from "@/components/image-carousel/carousel-image";
import { CarouselItem } from "@/components/image-carousel/carousel-item";
import { useVirtualisation } from "@/hooks/useVirtualisation";
import { cn } from "@/lib/utils";
import { Orientation, Photo } from "@/types";
import { ComponentProps, useRef } from "react";

interface ImageCarouselProps extends ComponentProps<"div"> {
  loop?: boolean;
  gap?: number;
  orientation?: Orientation;
  itemSize: number;
  data: Photo[];
}

export const ImageCarousel = ({
  orientation = "horizontal",
  itemSize,
  loop,
  gap,
  data,
  className,
  ...props
}: ImageCarouselProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { visibleData, wrapperStyle, containerStyle } = useVirtualisation({
    ref,
    orientation,
    gap,
    data,
    loop,
    itemSize,
  });

  if (!data.length) {
    return null;
  }

  return (
    <CarouselContainer
      className={cn(loop && "hide-scrollbar", className)}
      aria-orientation={orientation}
      ref={ref}
      {...props}
    >
      <div style={containerStyle}>
        <ul style={wrapperStyle}>
          {visibleData.map(({ data, index }) => (
            <CarouselItem key={index} style={{ width: itemSize }}>
              <CarouselImage alt="" src={data.download_url} />
            </CarouselItem>
          ))}
        </ul>
      </div>
    </CarouselContainer>
  );
};
