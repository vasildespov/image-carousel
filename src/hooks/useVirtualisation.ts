import { useLoop } from "@/hooks/useLoop";
import { Orientation } from "@/types";
import { CSSProperties, RefObject, useMemo } from "react";

type UseVirtualisationProps<D, T extends HTMLElement> = {
  orientation?: Orientation;
  gap?: number;
  itemSize: number;
  data: D[];
  loop?: boolean;
  ref: RefObject<T | null>;
};

type UseVirtualisationReturn<D> = {
  containerStyle: CSSProperties;
  wrapperStyle: CSSProperties;
  visibleData: { index: number; data: D }[];
};

const OVERSCAN = 5;
const DEFAULT_GAP = 0;
export const useVirtualisation = <D, T extends HTMLElement>({
  gap = DEFAULT_GAP,
  loop,
  orientation,
  ref,
  itemSize,
  data,
}: UseVirtualisationProps<D, T>): UseVirtualisationReturn<D> => {
  const dataLength = data.length;
  const effectiveItemSize = itemSize + gap;

  const { scrollOffset, scrollContainerSize, loopSize } = useLoop({
    orientation,
    ref,
    dataLength,
    effectiveItemSize,
    loop,
  });

  const startIndex = useMemo(() => {
    const firstIndex = Math.max(
      0,
      Math.floor(scrollOffset / effectiveItemSize),
    );

    return loop ? firstIndex - OVERSCAN : Math.max(0, firstIndex - OVERSCAN);
  }, [scrollOffset, effectiveItemSize, loop]);

  const visibleItemsCount = useMemo(() => {
    return Math.ceil(scrollContainerSize / effectiveItemSize) + 2 * OVERSCAN;
  }, [effectiveItemSize, scrollContainerSize]);

  const visibleData = useMemo(() => {
    if (!loop) {
      const endIndex = startIndex + visibleItemsCount;
      const visible = data.slice(startIndex, Math.min(endIndex, dataLength));

      return visible.map((value, index) => ({
        data: value,
        index: index,
      }));
    }

    const result: { index: number; data: D }[] = [];
    for (let i = 0; i < visibleItemsCount; i++) {
      let dataIndex = (startIndex + i) % dataLength;
      if (dataIndex < 0) dataIndex += dataLength;
      result.push({ data: data[dataIndex], index: startIndex + i });
    }
    return result;
  }, [loop, dataLength, startIndex, visibleItemsCount, data]);

  const containerStyle = useMemo((): CSSProperties => {
    const sizeProperty = orientation === "horizontal" ? "width" : "height";
    const totalSize = loop
      ? 3 * loopSize
      : dataLength * effectiveItemSize - gap;

    return {
      [sizeProperty]: `${totalSize}px`,
      position: "relative",
    };
  }, [loop, loopSize, dataLength, effectiveItemSize, gap, orientation]);

  const wrapperStyle = useMemo((): CSSProperties => {
    const translateValue = startIndex * effectiveItemSize;
    const translateAxis = orientation === "vertical" ? "Y" : "X";
    const flexDirection = orientation === "horizontal" ? "row" : "column";

    return {
      ...(orientation === "horizontal"
        ? { width: "fit-content" }
        : { height: "fit-content" }),
      display: "flex",
      flexDirection: flexDirection,
      gap: gap,
      transform: `translate${translateAxis}(${translateValue}px)`,
      willChange: "transform",
    };
  }, [startIndex, effectiveItemSize, orientation, gap]);

  return {
    visibleData,
    containerStyle,
    wrapperStyle,
  };
};
