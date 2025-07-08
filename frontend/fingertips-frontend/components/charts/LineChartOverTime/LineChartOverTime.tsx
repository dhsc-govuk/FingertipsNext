import { LineChartVariant } from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';
import { LineChart } from '@/components/organisms/LineChart';
import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';
import { Session } from 'next-auth';

type LineChartOverTimeProps = {
  session: Session | null;
};

export function LineChartOverTime({
  session,
}: Readonly<LineChartOverTimeProps>) {
  const lineChartOverTimeData = useLineChartOverTimeData(session);
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
