"use client";

import { ProductImage } from "@/app/features/carousel/types";
import { cn } from "@/app/lib/utils";
import Image from "next/image";
import { ComponentProps } from "react";

interface CarouselProps extends ComponentProps<"ul"> {
  images: ProductImage[];
}

const Carousel = ({ images, className, ...props }: CarouselProps) => {
  return (
    <ul
      data-slot="carousel"
      className={cn(
        "relative no-scrollbar snap-mandatory overflow-scroll gap-10 snap-x w-full flex focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {images.length > 0 &&
        images.map((image) => (
          <CarouselItem key={`${image.url}`}>
            <CarouselImage src={image.url} alt={image.title} />
          </CarouselItem>
        ))}
    </ul>
  );
};

const CarouselItem = ({ className, ...props }: ComponentProps<"li">) => {
  return (
    <li
      data-slot="carousel-item"
      className={cn(
        "size-100 border shrink-0 min-w-0 grow-0",
        "flex relative snap-start items-center justify-center ",
        className,
      )}
      {...props}
    />
  );
};

const CarouselImage = ({
  alt,
  className,
  ...props
}: ComponentProps<typeof Image>) => {
  return (
    <Image
      data-slot="carousel-image"
      className={cn("object-contain", className)}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  );
};

export { Carousel, CarouselItem, CarouselImage };
