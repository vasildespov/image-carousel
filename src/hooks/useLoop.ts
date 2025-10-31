import { Orientation } from "@/types";
import { throttle } from "@/utils/throttle";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

type UseLoopProps<T extends HTMLElement> = {
  /** orientation of the list */
  orientation?: Orientation;
  /** ref of the scroll container */
  ref: RefObject<T | null>;
  /** total items in the list */
  dataLength: number;
  /** total item size including gap or margin */
  effectiveItemSize: number;
  /** enables infinite looping when true */
  loop?: boolean;
};

type UseLoopReturn = {
  /** stable scroll offset to prevent flickers during looping */
  scrollOffset: number;
  /** client width of the scroll container */
  scrollContainerSize: number;
  /** size in pixels of one full loop  */
  loopSize: number;
};

const DELAY = 10;
export const useLoop = <T extends HTMLElement = HTMLElement>({
  // orientation,
  ref,
  dataLength,
  effectiveItemSize,
  loop,
}: UseLoopProps<T>): UseLoopReturn => {
  const [scrollContainerSize, setScrollContainerSize] = useState(0);

  const loopSize = dataLength * effectiveItemSize;
  const loopStart = loopSize;
  const loopEnd = 2 * loopSize;

  const initialOffset = loop ? loopStart : 0;
  const [scrollOffset, setScrollOffset] = useState(initialOffset);
  const scrollOffsetRef = useRef(scrollOffset);

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container || !loop || dataLength === 0) return;

    if (scrollContainerSize === 0) {
      setScrollContainerSize(container.clientWidth);
    }

    const currentScrollLeft = scrollOffsetRef.current;
    let newScrollLeft = currentScrollLeft;

    if (currentScrollLeft < loopStart) {
      newScrollLeft = currentScrollLeft + loopSize;
    } else if (currentScrollLeft >= loopEnd) {
      newScrollLeft = currentScrollLeft - loopSize;
    }

    container.scrollLeft = newScrollLeft;
    setScrollOffset(newScrollLeft);

    if (newScrollLeft !== currentScrollLeft) {
      container.scrollLeft = newScrollLeft;
      setScrollOffset(newScrollLeft);
    }
  }, [
    scrollOffset,
    loop,
    loopSize,
    loopStart,
    loopEnd,
    dataLength,
    ref,
    scrollContainerSize,
  ]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const handleScroll = throttle(() => {
      scrollOffsetRef.current = container.scrollLeft;
      setScrollOffset(container.scrollLeft);
    }, DELAY);

    const observer = new ResizeObserver((entries) => {
      setScrollContainerSize(entries[0].target.clientWidth);
    });

    container.addEventListener("scroll", handleScroll, { passive: true });
    observer.observe(container);

    if (loop && dataLength > 0 && container.scrollLeft !== loopStart) {
      container.scrollLeft = loopStart;
    }

    return () => {
      container.removeEventListener("scroll", handleScroll);
      observer.unobserve(container);
    };
  }, [ref, loop, dataLength, loopStart]);

  return { scrollOffset, scrollContainerSize, loopSize };
};
