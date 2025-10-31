import { useLoop } from "@/hooks/useLoop";
import { Orientation } from "@/types";
import { RefObject, useLayoutEffect, useMemo } from "react";

type UseVirtualisationProps<D, T extends HTMLElement> = {
  /** orientation of the list */
  orientation?: Orientation;
  /** gap between list items */
  gap: number;
  /** size of each list item in pixels */
  itemSize: number;
  /** data rendered in the list */
  data: D[];
  /** enables infinite looping when true */
  loop?: boolean;
  /** ref of the list container */
  ref: RefObject<T | null>;
};

type UseVirtualisationReturn<D> = {
  /** list items that will be rendered */
  visibleData: D[];
};

const BUFFER = 3;
export const useVirtualisation = <D, T extends HTMLElement>({
  loop,
  orientation,
  ref,
  gap,
  itemSize,
  data,
}: UseVirtualisationProps<D, T>): UseVirtualisationReturn<D> => {
  const translateAxis = orientation === "vertical" ? "Y" : "X";
  const dataLength = data.length;
  const effectiveItemSize = itemSize + gap;

  const { scrollOffset, scrollContainerSize, loopSize } = useLoop({
    orientation,
    ref,
    dataLength,
    effectiveItemSize,
    loop,
  });

  const visibleItemsCount = useMemo(() => {
    return Math.ceil(scrollContainerSize / effectiveItemSize) + 2 * BUFFER;
  }, [effectiveItemSize, scrollContainerSize]);

  const startIndex = useMemo(() => {
    const firstIndex = Math.max(
      0,
      Math.floor(scrollOffset / effectiveItemSize),
    );

    return loop ? firstIndex - BUFFER : Math.max(0, firstIndex - BUFFER);
  }, [scrollOffset, effectiveItemSize, loop]);

  const visibleData = useMemo(() => {
    if (!loop || dataLength === 0) {
      const endIndex = startIndex + visibleItemsCount;
      return data.slice(startIndex, Math.min(endIndex, dataLength));
    }

    const result: D[] = [];
    for (let i = 0; i < visibleItemsCount; i++) {
      let dataIndex = (startIndex + i) % dataLength;
      if (dataIndex < 0) dataIndex += dataLength;
      result.push({ ...data[dataIndex], id: startIndex + i });
    }
    return result;
  }, [startIndex, visibleItemsCount, data, loop, dataLength]);

  const translate = `translate${translateAxis}(${startIndex * effectiveItemSize}px)`;
  const totalSize = `${loop ? 3 * loopSize : dataLength * effectiveItemSize - gap}px`;

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.style.setProperty("--item-size", `${itemSize}px`);
    container.style.setProperty("--total-size", totalSize);
    container.style.setProperty("--transform", translate);
  }, [ref, itemSize, totalSize, translate]);

  return {
    visibleData,
  };
};
