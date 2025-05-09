import React, { FC, useLayoutEffect } from 'react';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { BarChartEmbeddedTableRow } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedTable.types';
import { BarChartEmbeddedRow } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedRow';
import { useMoreRowsWhenScrolling } from '@/components/hooks/useMoreRowsWhenScrolling';
import { InViewTrigger } from '@/components/hooks/InViewTrigger';
import { Table } from 'govuk-react';

interface BarChartEmbeddedRowsProps {
  rows: BarChartEmbeddedTableRow[];
  maxValue: number;
  showConfidenceIntervalsData: boolean;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  measurementUnit?: string;
}

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

export const BarChartEmbeddedRows: FC<BarChartEmbeddedRowsProps> = ({
  rows,
  maxValue,
  showConfidenceIntervalsData,
  benchmarkComparisonMethod,
  polarity,
  measurementUnit = '',
}) => {
  const { triggerRef, rowsToShow, hasMore, nRowsToHide } =
    useMoreRowsWhenScrolling<BarChartEmbeddedTableRow>(rows, 50);
  const [averageHeight, setAverageHeight] = React.useState(150);

  useLayoutEffect(() => {
    setAverageHeight(getAverageHeight());
  }, [nRowsToHide]);

  const hiddenRows = Array(nRowsToHide)
    .fill(null)
    .map((_, i) => `hidden-row-${i}`);

  return (
    <>
      {rowsToShow.map((item) => (
        <BarChartEmbeddedRow
          key={item.area}
          item={item}
          maxValue={maxValue}
          showConfidenceIntervalsData={showConfidenceIntervalsData}
          benchmarkComparisonMethod={benchmarkComparisonMethod}
          polarity={polarity}
          measurementUnit={measurementUnit}
        />
      ))}
      {hiddenRows.map((key, index) => (
        <Table.Row key={key}>
          <Table.Cell colSpan={7} style={{ height: `${averageHeight}px` }}>
            {index === 0 ? (
              <InViewTrigger triggerRef={triggerRef} more={hasMore} />
            ) : (
              '...'
            )}
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );
};
