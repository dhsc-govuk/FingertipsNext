import React, { FC } from 'react';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { BarChartEmbeddedTableRow } from '@/components/charts/CompareAreasTable/BarChartEmbeddedTable/BarChartEmbeddedTable.types';
import { BarChartEmbeddedRow } from '@/components/charts/CompareAreasTable/BarChartEmbeddedRow/BarChartEmbeddedRow';
import { useMoreRowsWhenScrolling } from '@/components/hooks/useMoreRowsWhenScrolling';
import { BarChartEmbeddedPlaceholderRows } from '@/components/charts/CompareAreasTable/BarChartEmbeddedPlaceholderRows/BarChartEmbeddedPlaceholderRows';

interface BarChartEmbeddedRowsProps {
  rows: BarChartEmbeddedTableRow[];
  maxValue: number;
  showConfidenceIntervalsData: boolean;
  benchmarkComparisonMethod: BenchmarkComparisonMethod;
  polarity: IndicatorPolarity;
  measurementUnit?: string;
  period?: string;
}

export const BarChartEmbeddedRows: FC<BarChartEmbeddedRowsProps> = ({
  rows,
  maxValue,
  showConfidenceIntervalsData,
  benchmarkComparisonMethod,
  polarity,
  measurementUnit = '',
  period,
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
          period={period}
        />
      ))}
      <BarChartEmbeddedPlaceholderRows
        nRowsToHide={nRowsToHide}
        triggerRef={triggerRef}
      />
    </>
  );
};
