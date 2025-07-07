import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { H3 } from 'govuk-react';

import { useCompareAreasTableData } from '@/components/charts/CompareAreasTable/hooks/useCompareAreasTableData';
import { BarChartEmbeddedTable } from '@/components/charts/CompareAreasTable/BarChartEmbeddedTable/BarChartEmbeddedTable';
import { SegmentationDropDowns } from '@/components/forms/SegmentationOptions/SegmentationDropDowns';

export function CompareAreasTable() {
  const data = useCompareAreasTableData();
  if (!data) return null;
  const {
    benchmarkToUse,
    healthIndicatorData,
    groupData,
    englandData,
    benchmarkComparisonMethod,
    polarity,
    indicatorMetaData,
  } = data;

  return (
    <StyleChartWrapper>
      <H3>Compare an indicator by areas</H3>
      <BarChartEmbeddedTable
        key={`barchart-${benchmarkToUse}`}
        data-testid="barChartEmbeddedTable-component"
        healthIndicatorData={healthIndicatorData}
        englandData={englandData}
        groupIndicatorData={groupData}
        indicatorMetadata={indicatorMetaData}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        polarity={polarity}
        benchmarkToUse={benchmarkToUse}
      />
    </StyleChartWrapper>
  );
}
