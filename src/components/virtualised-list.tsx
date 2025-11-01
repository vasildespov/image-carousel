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
      <div style={containerStyle}>
        <ul style={wrapperStyle}>
          {visibleData.map(({ data, index }) => (
            <li
              key={index}
              className="size-15 items-center justify-center flex border w-full"
            >
              {data}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
