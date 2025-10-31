import { Orientation } from "@/types";
import { throttle } from "@/utils/throttle";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

type UseLoopProps<T extends HTMLElement> = {
  /** ref of the list container */
  ref: RefObject<T | null>;
  /** orientation of the list */
  orientation?: Orientation;
  /** total items in the list */
  dataLength: number;
  /** actual item size including gap or margin */
  effectiveItemSize: number;
  /** enables infinite looping when true */
  loop?: boolean;
};

type UseLoopReturn = {
  /** stable scroll offset to prevent flickers during looping */
  scrollOffset: number;
  /** size of the scroll container */
  scrollContainerSize: number;
  /** size in pixels of one full loop  */
  loopSize: number;
};

const DELAY = 10;
export const useLoop = <T extends HTMLElement = HTMLElement>({
  orientation,
  ref,
  dataLength,
  effectiveItemSize,
  loop,
}: UseLoopProps<T>): UseLoopReturn => {
  const [scrollContainerSize, setScrollContainerSize] = useState(0);

  const scrollProp = orientation === "vertical" ? "scrollTop" : "scrollLeft";
  const sizeProp = orientation === "vertical" ? "clientHeight" : "clientWidth";
  const loopSize = dataLength * effectiveItemSize;
  const loopEnd = 2 * loopSize;
  const initialOffset = loop ? loopSize : 0;
  const [scrollOffset, setScrollOffset] = useState(initialOffset);
  const scrollOffsetRef = useRef(initialOffset);

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container || !loop || dataLength === 0) return;

    if (scrollContainerSize === 0) {
      setScrollContainerSize(container[sizeProp]);
    }

    const currentScrollOffset = scrollOffsetRef.current;
    let newScrollOffset = currentScrollOffset;

    if (currentScrollOffset < loopSize) {
      newScrollOffset = currentScrollOffset + loopSize;
    } else if (currentScrollOffset >= loopEnd) {
      newScrollOffset = currentScrollOffset - loopSize;
    }

    if (newScrollOffset !== currentScrollOffset) {
      container[scrollProp] = newScrollOffset;
      scrollOffsetRef.current = newScrollOffset;
      setScrollOffset(newScrollOffset);
    }
  }, [
    scrollOffset,
    loop,
    loopSize,
    loopEnd,
    dataLength,
    ref,
    scrollContainerSize,
    sizeProp,
    scrollProp,
  ]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    if (loop && dataLength > 0 && container[scrollProp] !== loopSize) {
      container[scrollProp] = loopSize;
    }

    const handleScroll = throttle(() => {
      scrollOffsetRef.current = container[scrollProp];
      setScrollOffset(container[scrollProp]);
    }, DELAY);

    const observer = new ResizeObserver((entries) => {
      setScrollContainerSize(entries[0].target[sizeProp]);
    });

    container.addEventListener("scroll", handleScroll, { passive: true });
    observer.observe(container);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      observer.unobserve(container);
    };
  }, [ref, loop, dataLength, loopSize, scrollProp, sizeProp]);

  return { scrollOffset, scrollContainerSize, loopSize };
};
