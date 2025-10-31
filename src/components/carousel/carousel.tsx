"use client";

import { CarouselContainer } from "@/components/carousel/carousel-container";
import { CarouselImage } from "@/components/carousel/carousel-image";
import { CarouselItem } from "@/components/carousel/carousel-item";
import { useVirtualisation } from "@/hooks/useVirtualisation";
import { Orientation, Photo } from "@/types";
import { ComponentProps, CSSProperties } from "react";

interface CarouselProps extends ComponentProps<"div"> {
  /** enables infinite looping when true */
  loop?: boolean;
  /** gap between carousel items */
  gap?: number;
  /** orientation of the list */
  orientation?: Orientation;
  /** size of each item in pixels */
  itemSize?: number;
  /** data rendered in the list */
  data: Photo[];
}

const GAP = 0;
const ITEM_SIZE = 300;
const Carousel = ({
  gap = GAP,
  orientation = "horizontal",
  loop = true,
  itemSize = ITEM_SIZE,
  data,
  ...props
}: CarouselProps) => {
  const { ref, translate, totalSize, visibleData } = useVirtualisation<
    Photo,
    HTMLDivElement
  >({
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
      aria-orientation={orientation}
      style={
        {
          "--item-size": `${ITEM_SIZE}px`,
          "--total-size": totalSize,
          "--transform": translate,
        } as CSSProperties
      }
      ref={ref}
      {...props}
    >
      {visibleData.map(({ download_url, id }) => (
        <CarouselItem key={id}>
          <CarouselImage src={download_url} alt={id} />
        </CarouselItem>
      ))}
    </CarouselContainer>
  );
};

export { Carousel };
