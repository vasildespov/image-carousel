import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export const CarouselContainer = ({
  children,
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "whitespace-nowrap overflow-auto aria-[orientation=horizontal]:h-fit aria-[orientation=vertical]:w-fit focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
