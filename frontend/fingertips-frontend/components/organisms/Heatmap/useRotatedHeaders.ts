import { useEffect, useRef } from 'react';

// start with the table having a header row with a fixed generous height
// when rendered, measure the height of the rotated heading and
// adjust the th height accordingly
// in addition add right margin to account for any items handing over the
// far right edge of the table
export const useRotatedHeaders = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const tableElement = containerRef.current.querySelector('table');
    if (!tableElement) return;
    const trElement = containerRef.current.querySelector('tr');
    if (!trElement) return;

    const headerCells = trElement.querySelectorAll('th');
    let rightHandEdge = 0;
    headerCells.forEach((thElement) => {
      const h4Element = thElement.querySelector('h4');
      if (!h4Element) return;

      const { height, right } = h4Element.getBoundingClientRect();
      // add 25 because the rotated header doesn't start at the bottom edge of the th
      thElement.style.height = `${height + 25}px`;

      rightHandEdge = Math.max(rightHandEdge, right);
    });

    // allow for the last item/s hanging over the right hand edge of the table
    const { right: tableRight } = tableElement.getBoundingClientRect();
    const extendsBeyondTableEdge = Math.max(0, rightHandEdge - tableRight);
    tableElement.style.marginRight = `${extendsBeyondTableEdge}px`;
  }, []);

  return { containerRef };
};
