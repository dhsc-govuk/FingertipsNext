import React, { FC } from 'react';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { BarChartEmbeddedTableRow } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedTable.types';
import { BarChartEmbeddedRow } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedRow';
import { useMoreRowsWhenScrolling } from '@/components/hooks/useMoreRowsWhenScrolling';

interface BarChartEmbeddedRowsProps {
  rows: BarChartEmbeddedTableRow[];
  maxValue: number;
  showConfidenceIntervalsData: boolean;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  measurementUnit?: string;
}

export const BarChartEmbeddedRows: FC<BarChartEmbeddedRowsProps> = ({
  rows,
  maxValue,
  showConfidenceIntervalsData,
  benchmarkComparisonMethod,
  polarity,
  measurementUnit = '',
}) => {
  const { triggerRef, rowsToShow, hasMore } =
    useMoreRowsWhenScrolling<BarChartEmbeddedTableRow>(rows, 10);

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
      <tr>
        <td>
          <div ref={triggerRef}>{hasMore ? 'Loading...' : null}</div>
        </td>
      </tr>
    </>
  );
};
