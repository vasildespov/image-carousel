"use client";

import { CarouselContainer } from "@/components/carousel/carousel-container";
import { CarouselImage } from "@/components/carousel/carousel-image";
import { CarouselItem } from "@/components/carousel/carousel-item";
import { useVirtualisation } from "@/hooks/useVirtualisation";
import { Orientation, Photo } from "@/types";
import { ComponentProps, useRef } from "react";

interface CarouselProps extends ComponentProps<"div"> {
  /** enables infinite looping when true */
  loop?: boolean;
  /** gap between list items */
  gap?: number;
  /** orientation of the list */
  orientation?: Orientation;
  /** size of each list item in pixels */
  itemSize?: number;
  /** data rendered in the list */
  data: Photo[];
}

const GAP = 0;
const ITEM_SIZE = 300;
const Carousel = ({
  orientation = "horizontal",
  loop = true,
  gap = GAP,
  itemSize = ITEM_SIZE,
  data,
  ...props
}: CarouselProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { visibleData } = useVirtualisation<Photo, HTMLDivElement>({
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
    <CarouselContainer aria-orientation={orientation} ref={ref} {...props}>
      {visibleData.map(({ download_url, id }) => (
        <CarouselItem key={id}>
          <CarouselImage src={download_url} loading="eager" alt="" />
        </CarouselItem>
      ))}
    </CarouselContainer>
  );
};

export { Carousel };
