import { useLoop } from "@/hooks/use-loop";
import {
  getContainerStyle,
  getWrapperStyle,
} from "@/hooks/use-virtualisation.utils";
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
  orientation = "horizontal",
  loop = false,
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

  const firstIndex = Math.max(0, Math.floor(scrollOffset / effectiveItemSize));
  const startIndex = loop
    ? firstIndex - OVERSCAN
    : Math.max(0, firstIndex - OVERSCAN);

  const visibleRange = useMemo(() => {
    const start = Math.max(
      0,
      Math.floor(scrollOffset / effectiveItemSize) - OVERSCAN,
    );
    const count =
      Math.ceil(scrollContainerSize / effectiveItemSize) + 2 * OVERSCAN;
    return { start, count };
  }, [scrollOffset, effectiveItemSize, scrollContainerSize]);

  const visibleData = useMemo(() => {
    if (dataLength === 0) return [];

    const { start: startIndex, count: visibleItemsCount } = visibleRange;

    if (!loop) {
      const endIndex = Math.min(startIndex + visibleItemsCount, dataLength);
      const actualStart = Math.max(0, startIndex);

      const result = new Array(endIndex - actualStart);
      for (let i = 0; i < result.length; i++) {
        result[i] = {
          data: data[actualStart + i],
          index: actualStart + i,
        };
      }
      return result;
    }

    const result = new Array(visibleItemsCount);
    for (let i = 0; i < visibleItemsCount; i++) {
      const dataIndex =
        (((startIndex + i) % dataLength) + dataLength) % dataLength;
      result[i] = {
        data: data[dataIndex],
        index: startIndex + i,
      };
    }
    return result;
  }, [loop, dataLength, visibleRange, data]);

  const totalSize = loop ? 3 * loopSize : dataLength * effectiveItemSize - gap;
  const containerStyle = getContainerStyle({ orientation, totalSize });

  const translateValue = startIndex * effectiveItemSize;
  const wrapperStyle = getWrapperStyle({ orientation, gap, translateValue });

  if (dataLength === 0 || effectiveItemSize <= 0) {
    return { visibleData: [], containerStyle: {}, wrapperStyle: {} };
  }

  return {
    visibleData,
    containerStyle,
    wrapperStyle,
  };
};
