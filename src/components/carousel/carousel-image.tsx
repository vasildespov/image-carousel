import { cn } from "@/lib/utils";
import NextImage from "next/image";
import { ComponentProps, useState } from "react";

// Keeping the loaded images in "cache" allows for images to have loading state effect.
// Otherwise, because there are unmount/remount events while looping the carousel,
// the initial state gets reset and that causes a flicker which doesn't look good.
const IMAGE_URL_CACHE = new Set<string>();

export const CarouselImage = ({
  src,
  className,
  ...props
}: ComponentProps<typeof NextImage>) => {
  const [isLoading, setIsLoading] = useState(
    !IMAGE_URL_CACHE.has(src as string),
  );

  const handleOnLoad = () => {
    IMAGE_URL_CACHE.add(src as string);
    setIsLoading(false);
  };

  return (
    <div className="relative size-full">
      {isLoading && (
        <div className="absolute inset-0 bg-foreground/50 animate-pulse" />
      )}

      <NextImage
        className={cn(
          "object-cover transition-opacity",
          isLoading ? "opacity-0" : "opacity-100",
          className,
        )}
        onLoad={handleOnLoad}
        src={src}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        {...props}
      />
    </div>
  );
};
