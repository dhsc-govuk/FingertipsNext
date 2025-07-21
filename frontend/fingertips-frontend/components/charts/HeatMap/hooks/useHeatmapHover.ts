import { MouseEvent, useCallback, useRef, useState } from 'react';
import { TransientHeatmapHoverProps } from '@/components/charts/HeatMap/components/hover';
import { Cell } from '../heatmap.types';

export const useHeatmapHover = () => {
  const [hover, setHover] = useState<TransientHeatmapHoverProps | null>(null);
  const refHoverRect = useRef<DOMRect | null>(null);

  let left = 0;
  let top = 0;

  const handleMouseOverCell = useCallback(
    (cell?: Cell) => (event: MouseEvent) => {
      setHover(cell?.hoverProps ?? null);
      refHoverRect.current = cell
        ? event.currentTarget.getBoundingClientRect()
        : null;
    },
    []
  );

  if (refHoverRect.current && hover) {
    left = refHoverRect.current.right + 12;
    top =
      refHoverRect.current.top +
      (refHoverRect.current.bottom - refHoverRect.current.top) / 2;
  }

  return { handleMouseOverCell, hover, left, top };
};
