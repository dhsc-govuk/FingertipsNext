import { useLayoutEffect } from 'react';

export const useHeatmapRotatedHeadingLayout = (id: string) => {
  useLayoutEffect(() => {
    updateTableLayout(id);
    const frame = requestAnimationFrame(() => {
      // needs to render the table in a frame before measurement
      // as tables do auto-layout after being rendered,
      // calling updateTableSizing once doesn't seem to be enough
      updateTableLayout(id);
    });

    return () => cancelAnimationFrame(frame);
  }, [id]);
};

// looks at rotated headings in the heatmap table and measures each one
// then adjusts the height of the th to include the rotated text
// in addition adjusts the width of the containing div such that space is allowed
// at the right of the table for the heading to overrun the table edge
export const updateTableLayout = (id: string) => {
  const elements = getTableElements(id);
  if (!elements) return;

  const { heatmapDiv, table, lastTableHeader, angledText, lastAngledText } =
    elements;

  // find the max height of rotated span elements and adjust heading height to match
  const maxHeight = getMaxHeight(angledText);
  lastTableHeader.style.height = `${maxHeight + 10}px`;

  // extend the wrapper to enclose the table and any overflow from the rotated header
  const diff = getWidthOverflow(lastTableHeader, lastAngledText);
  heatmapDiv.style.width = `${table.clientWidth + diff + 10}px`;
};

export const getTableElements = (id: string) => {
  const heatmapDiv = document.getElementById(id);
  if (!heatmapDiv) return;
  const table = heatmapDiv.firstElementChild as HTMLTableElement;
  if (!table) return;
  const lastTableHeader = table.querySelector(
    'th:last-of-type'
  ) as HTMLTableCellElement;
  if (!lastTableHeader) return;

  const angledText = table.querySelectorAll('.rotatedHeading');
  if (!angledText || angledText.length === 0) return;

  const lastAngledText = angledText[angledText.length - 1] as HTMLSpanElement;
  if (!lastAngledText) return;
  return {
    heatmapDiv,
    table,
    lastTableHeader,
    angledText: [...angledText] as HTMLSpanElement[],
    lastAngledText,
  };
};

export const getMaxHeight = (angledText: HTMLSpanElement[]) => {
  const heights = angledText.map((text) => text.getBoundingClientRect().height);
  return Math.round(Math.max(...heights, 50));
};

export const getWidthOverflow = (
  lastTableHeader: HTMLTableCellElement,
  lastAngledText: HTMLSpanElement
) => {
  const { right: lastHeaderRight } = lastTableHeader.getBoundingClientRect();
  const { right: lastAngledContentRight } =
    lastAngledText.getBoundingClientRect();
  return Math.round(Math.max(0, lastAngledContentRight - lastHeaderRight));
};
