import React, { FC } from 'react';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { BarChartEmbeddedTableRow } from '@/components/organisms/BarChartEmbeddedTable/BarChartEmbeddedTable.types';
import { BarChartEmbeddedRow } from '@/components/organisms/BarChartEmbeddedTable/components/BarChartEmbeddedRow/BarChartEmbeddedRow';
import { useMoreRowsWhenScrolling } from '@/components/hooks/useMoreRowsWhenScrolling';
import { BarChartEmbeddedPlaceholderRows } from '@/components/organisms/BarChartEmbeddedTable/components/BarChartEmbeddedPlaceholderRows/BarChartEmbeddedPlaceholderRows';

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
  const { triggerRef, rowsToShow, nRowsToHide } =
    useMoreRowsWhenScrolling<BarChartEmbeddedTableRow>(rows, 50);

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
      <BarChartEmbeddedPlaceholderRows
        nRowsToHide={nRowsToHide}
        triggerRef={triggerRef}
      />
    </>
  );
};
