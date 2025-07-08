import { LineChartTable } from '@/components/organisms/LineChartTable';
import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';
import { Session } from 'next-auth';

type LineChartTableOverTimeProps = {
  session: Session | null;
};

export function LineChartTableOverTime({
  session,
}: Readonly<LineChartTableOverTimeProps>) {
  const lineChartOverTimeData = useLineChartOverTimeData(session);
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
    />
  );
}
