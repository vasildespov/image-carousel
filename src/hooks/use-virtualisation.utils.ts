import { Orientation } from "@/types";
import { CSSProperties } from "react";

interface GetContainerStyleProps {
  orientation: Orientation;
  totalSize: number;
}
export const getContainerStyle = ({
  orientation,
  totalSize,
}: GetContainerStyleProps): CSSProperties => {
  const sizeProperty = orientation === "horizontal" ? "width" : "height";

  return {
    [sizeProperty]: `${totalSize}px`,
    position: "relative",
  };
};

interface GetWrapperStyleProps {
  orientation: Orientation;
  translateValue: number;
  gap: number;
}
export const getWrapperStyle = ({
  orientation,
  translateValue,
  gap,
}: GetWrapperStyleProps): CSSProperties => {
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
