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
        "group/carousel carousel",
        "whitespace-nowrap aria-[orientation=horizontal]:h-fit aria-[orientation=vertical]:w-fit aria-[orientation=vertical]:overflow-y-scroll aria-[orientation=horizontal]:overflow-x-scroll focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <div className="relative group-[&[aria-orientation=horizontal]]/carousel:w-(--total-size) group-[&[aria-orientation=vertical]]/carousel:h-(--total-size)">
        <ul className="flex group-[&[aria-orientation=vertical]]/carousel:flex-col size-fit will-change-transform transform-(--transform)">
          {children}
        </ul>
      </div>
    </div>
  );
};
