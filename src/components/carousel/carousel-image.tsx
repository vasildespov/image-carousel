import { cn } from "@/lib/utils";
import NextImage from "next/image";
import { ComponentProps } from "react";

export const CarouselImage = ({
  alt,
  className,
  ...props
}: ComponentProps<typeof NextImage>) => {
  return (
    <NextImage
      className={cn("object-cover", className)}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      {...props}
    />
  );
};
