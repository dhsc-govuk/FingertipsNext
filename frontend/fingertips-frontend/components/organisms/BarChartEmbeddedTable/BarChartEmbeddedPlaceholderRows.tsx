import React, { FC, RefObject, useLayoutEffect } from 'react';
import { Table } from 'govuk-react';
import { InViewTrigger } from '@/components/hooks/InViewTrigger';

const getAverageHeight = () => {
  const elements = document.getElementsByClassName('BarChartEmbeddedRow');
  if (!elements || elements.length === 0) return 0;
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (!first || !last) return 0;
  const { top } = first.getBoundingClientRect();
  const { bottom } = last.getBoundingClientRect();
  return (bottom - top) / elements.length;
};

interface BarChartEmbeddedPlaceholderRowsProps {
  nRowsToHide: number;
  triggerRef: RefObject<HTMLDivElement | null>;
}

export const BarChartEmbeddedPlaceholderRows: FC<
  BarChartEmbeddedPlaceholderRowsProps
> = ({ nRowsToHide, triggerRef }) => {
  const [averageHeight, setAverageHeight] = React.useState(150);

  useLayoutEffect(() => {
    setAverageHeight(getAverageHeight());
  }, [nRowsToHide]);

  const hiddenRows = Array(nRowsToHide)
    .fill(null)
    .map((_, i) => `hidden-row-${i}`);

  return (
    <>
      {hiddenRows.map((key, index) => (
        <Table.Row key={key}>
          <Table.Cell colSpan={7} style={{ height: `${averageHeight}px` }}>
            {index === 0 ? (
              <InViewTrigger triggerRef={triggerRef} more={nRowsToHide > 0} />
            ) : null}
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );
};
