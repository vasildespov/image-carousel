import { useLoop } from "@/hooks/useLoop";
import { Orientation } from "@/types";
import { RefObject, useMemo, useRef } from "react";

type UseVirtualisationProps<D> = {
  /** orientation of the list */
  orientation?: Orientation;
  /** gap between items to account for when calculating translation and container size */
  gap: number;
  /** size of each item in pixels */
  itemSize: number;
  /** data rendered in the list */
  data: D[];
  /** enables infinite looping when true */
  loop?: boolean;
};

type UseVirtualisationReturn<D, T extends HTMLElement> = {
  /** count of rendered items including buffer */
  visibleData: D[];
  /** CSS transform value in pixels used to position the viewport correctly */
  translate: string;
  /** total size of the container in pixels */
  totalSize: string;
  /** ref of the scroll container */
  ref: RefObject<T | null>;
};

const BUFFER = 3;
export const useVirtualisation = <D, T extends HTMLElement = HTMLElement>({
  orientation,
  gap,
  itemSize,
  data,
  loop,
}: UseVirtualisationProps<D>): UseVirtualisationReturn<D, T> => {
  const dataLength = data.length;
  const effectiveItemSize = itemSize + gap;
  const ref = useRef<T>(null);

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
    const firstVisibleIndex = Math.max(
      0,
      Math.floor(scrollOffset / effectiveItemSize),
    );

    return loop
      ? firstVisibleIndex - BUFFER
      : Math.max(0, firstVisibleIndex - BUFFER);
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

  const translate = `translateX(${startIndex * effectiveItemSize}px)`;
  const totalSize = `${loop ? 3 * loopSize : dataLength * effectiveItemSize - gap}px`;

  return {
    ref,
    visibleData,
    translate,
    totalSize,
  };
};
