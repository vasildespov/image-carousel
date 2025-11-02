# Virtualisation hooks & components

## Summary

This is my implementation of image carousel and list virtualisation.
It includes two hooks: `useVirtualisation` and `useLoop` and also a pre-built component - `ImageCarousel`.
The project's been setup with NextJS and Tailwind CSS. The hook could work with any css solution.

**Features:**

- Renders only visible items even if data is 1000+
- Supports infinite looping
- Supports orientation (horizontal/vertical)
- Configurable item sizing and gaps
- Reusable headless hook and component

---

## Example
```jsx
"use client";

import { useVirtualisation } from "@/hooks/use-virtualisation";
import { useMemo, useRef } from "react";

export const VirtualisedList = () => {
  const ref = useRef<HTMLDivElement>(null);
  const data = useMemo(() => Array.from(Array(99999).keys()), []);

  const { visibleData, wrapperStyle, containerStyle } = useVirtualisation({
    data,
    itemSize: 60,
    orientation: "vertical",
    ref: ref,
  });

  return (
    <div ref={ref} className="overflow-auto border size-75">
      <div style={containerStyle}> // apply container styles
        <ul style={wrapperStyle}> // apply wrapper styles
          {visibleData.map(({ data, index }) => (
            <li
              // use index from hook as React key
              key={index}
              className="size-15 items-center justify-center flex border w-full" // item size styles must match the itemSize input to the hook
            >
              {data}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
```

## Core hooks

### `useVirtualisation`
The main hook that calculates which items should be rendered. It can be used to build custom implementations.
```typescript
type UseVirtualisationProps<D, T extends HTMLElement> = {
  orientation?: Orientation; // orientation of the list
  gap?: number; // spacing between items
  itemSize: number; // fixed size of each item in pixels
  data: D[]; // list of items to virtualise
  loop?: boolean; // enable infinite scrolling (default: false)
  ref: RefObject<T | null>; // ref to scroll container
};

type UseVirtualisationReturn<D> = {
  containerStyle: CSSProperties; // styles for outer container
  wrapperStyle: CSSProperties; // styles for wrapper (handles translation)
  visibleData: { index: number; data: D }[]; // items to render
};
```

#### Hook logic
1. Tracks scroll position via `useLoop` hook
2. Calculates visible range based on scroll offset and container size
3. Adds overscan buffer (5 items by default) for smoother scrolling
4. For looping mode: wraps indices using modulo arithmetic
5. Returns only the items that should be rendered
6. Visible data contains an index property which can be used as React key (important for looping where there can be duplicate items)
7. Returns style objects for flexibility
---

### `useLoop`
Handles infinite scrolling behavior by managing scroll position.
```typescript
type UseLoopProps<T extends HTMLElement> = {
  ref: RefObject<T | null>; // ref to scroll container
  orientation?: Orientation; // orientation of the list
  dataLength: number; // total number of items
  effectiveItemSize: number; // itemSize + gap
  loop?: boolean; // enable looping
};

type UseLoopReturn = {
  scrollOffset: number; // current scroll position
  scrollContainerSize: number; // width/height of container
  loopSize: number; // total virtual size (dataLength × effectiveItemSize)
};
```

#### Hook logic
1. Creates a virtual scroll space that's twice the total data size (for looping)
2. Monitors scroll position and resets it when reaching boundaries
3. When scroll goes below loopSize, wraps by adding loopSize
4. When scroll exceeds 2×loopSize, wraps by subtracting loopSize
5. Uses ResizeObserver to track container size changes

The loop works by creating multiple virtual copies of your data:

```
[Original] [Original] - scroll wraps between these copies
0          loopSize   2×loopSize
```

When the user scrolls to the edge, the scroll position is adjusted, creating the illusion of infinite scrolling. The onScroll callback is not being throttled because it has to be as responsive as possible. Even a small delay of like 16ms causes minor bugs in scroll syncing.

---

## Components

### `ImageCarousel`
Pre-built image carousel component that can be configured via props.
```typescript
interface ImageCarouselProps extends ComponentProps<"div"> {
  data: Photo[]; // array of photo objects with download_url
  itemSize: number; // fixed size of each item in pixels
  orientation?: Orientation; // orientation of the list
  gap?: number; // space between items
  loop?: boolean; // enable infinite scrolling
}
```
### `CarouselContainer`
Main container of the carousel

### `CarouselItem`
Used to render any content in the carousel

### `CarouselImage`
I implemented "caching" in the image component which persists across renders and instances so that a shimmer effect is shown until the image has loaded. Otherwise especially when looping and the list items unmount & mount frequently the initial state is reset and that causes flicker of the shimmer effect

---

## See complete working examples in the codebase:
- `image-carousel.tsx` - Photo carousel with infinite loop
- `virtualised-list.tsx` - Large vertical list
