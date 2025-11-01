import { cn } from "@/lib/utils";
import NextImage from "next/image";
import { ComponentProps, useState } from "react";

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
        src={src}
        fill
        loading="eager"
        fetchPriority="high"
        onLoad={handleOnLoad}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className={cn(
          "object-cover transition-opacity",
          isLoading ? "opacity-0" : "opacity-100",
          className,
        )}
        {...props}
      />
    </div>
  );
};
