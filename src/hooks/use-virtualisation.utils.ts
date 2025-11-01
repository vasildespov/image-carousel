import { Orientation } from "@/types";
import { CSSProperties } from "react";

export const getContainerStyle = (
  orientation: Orientation,
  loop: boolean,
  loopSize: number,
  dataLength: number,
  effectiveItemSize: number,
  gap: number,
): CSSProperties => {
  const sizeProperty = orientation === "horizontal" ? "width" : "height";
  const totalSize = loop ? 3 * loopSize : dataLength * effectiveItemSize - gap;

  return {
    [sizeProperty]: `${totalSize}px`,
    position: "relative",
  };
};

export const getWrapperStyle = (
  orientation: Orientation,
  startIndex: number,
  effectiveItemSize: number,
  gap: number,
): CSSProperties => {
  const translateValue = startIndex * effectiveItemSize;
  const translateAxis = orientation === "vertical" ? "Y" : "X";
  const flexDirection = orientation === "horizontal" ? "row" : "column";

  return {
    ...(orientation === "horizontal"
      ? { width: "fit-content" }
      : { height: "fit-content" }),
    display: "flex",
    flexDirection,
    gap,
    transform: `translate${translateAxis}(${translateValue}px)`,
    willChange: "transform",
  };
};
