import { LineChartVariant } from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';
import { LineChart } from '@/components/organisms/LineChart';
import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';

export function LineChartOverTime() {
  const lineChartOverTimeData = useLineChartOverTimeData();
  if (!lineChartOverTimeData) return null;
  const { chartOptions } = lineChartOverTimeData;

  return (
    <LineChart
      title={chartOptions.title?.text ?? ''}
      lineChartOptions={chartOptions}
      variant={LineChartVariant.Standard}
    />
  );
}
