import { LineChartTable } from '@/components/organisms/LineChartTable';
import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';

export function LineChartTableOverTime() {
  const lineChartOverTimeData = useLineChartOverTimeData();
  if (!lineChartOverTimeData) return null;

  const {
    chartOptions,
    areaData,
    englandData,
    groupData,
    indicatorMetaData,
    polarity,
    benchmarkComparisonMethod,
    benchmarkToUse,
    frequency,
  } = lineChartOverTimeData;
  return (
    <LineChartTable
      title={chartOptions.title?.text ?? ''}
      healthIndicatorData={areaData}
      englandIndicatorData={englandData}
      groupIndicatorData={groupData}
      indicatorMetadata={indicatorMetaData}
      benchmarkComparisonMethod={benchmarkComparisonMethod}
      polarity={polarity}
      benchmarkToUse={benchmarkToUse}
      frequency={frequency}
    />
  );
}
