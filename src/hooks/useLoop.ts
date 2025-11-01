import { Orientation } from "@/types";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

type UseLoopProps<T extends HTMLElement> = {
  ref: RefObject<T | null>;
  orientation?: Orientation;
  dataLength: number;
  effectiveItemSize: number;
  loop?: boolean;
};

type UseLoopReturn = {
  scrollOffset: number;
  scrollContainerSize: number;
  loopSize: number;
};

export const useLoop = <T extends HTMLElement = HTMLElement>({
  orientation,
  ref,
  dataLength,
  effectiveItemSize,
  loop,
}: UseLoopProps<T>): UseLoopReturn => {
  const scrollProp = orientation === "vertical" ? "scrollTop" : "scrollLeft";
  const sizeProp = orientation === "vertical" ? "clientHeight" : "clientWidth";

  const loopSize = dataLength * effectiveItemSize;
  const loopEnd = 2 * loopSize;
  const initialOffset = loop ? loopSize : 0;

  const [scrollContainerSize, setScrollContainerSize] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(initialOffset);
  const scrollOffsetRef = useRef(initialOffset);

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container || !loop || dataLength === 0) return;

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScrollOffset(newScrollOffset);
    }
  }, [dataLength, loop, loopEnd, loopSize, ref, scrollOffset, scrollProp]);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    if (loop && dataLength > 0 && container[scrollProp] !== loopSize) {
      container[scrollProp] = loopSize;
    }

    const handleScroll = () => {
      scrollOffsetRef.current = container[scrollProp];
      setScrollOffset(container[scrollProp]);
    };

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
