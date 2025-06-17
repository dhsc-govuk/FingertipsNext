import { LineChartTable } from '@/components/organisms/LineChartTable';
import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';

export function LineChartTableOverTime() {
  const lineChartOverTimeData = useLineChartOverTimeData();
  if (!lineChartOverTimeData) return null;

  const {
    chartOptions,
    areaDataWithoutInequalities,
    englandDataWithoutInequalities,
    groupDataWithoutInequalities,
    indicatorMetaData,
    polarity,
    benchmarkComparisonMethod,
    benchmarkToUse,
  } = lineChartOverTimeData;
  return (
    <LineChartTable
      title={chartOptions.title?.text ?? ''}
      healthIndicatorData={areaDataWithoutInequalities}
      englandIndicatorData={englandDataWithoutInequalities}
      groupIndicatorData={groupDataWithoutInequalities}
      indicatorMetadata={indicatorMetaData}
      benchmarkComparisonMethod={benchmarkComparisonMethod}
      polarity={polarity}
      benchmarkToUse={benchmarkToUse}
    />
  );
}
