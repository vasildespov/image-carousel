import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export const CarouselItem = ({ className, ...props }: ComponentProps<"li">) => {
  return (
    <li
      className={cn(
        "size-(--item-size)",
        "aspect-square flex relative items-center justify-center",
        className,
      )}
      {...props}
    />
  );
};
