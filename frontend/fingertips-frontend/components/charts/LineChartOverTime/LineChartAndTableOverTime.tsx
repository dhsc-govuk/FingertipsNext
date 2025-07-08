import { H3 } from 'govuk-react';
import { TabContainer } from '@/components/layouts/tabContainer';
import { DataSource } from '@/components/atoms/DataSource/DataSource';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';
import { LineChartOverTime } from '@/components/charts/LineChartOverTime/LineChartOverTime';
import { LineChartTableOverTime } from '@/components/charts/LineChartOverTime/LineChartTableOverTime';
import { Session } from 'next-auth';

type LineChartAndTableOverTimeProps = {
  session: Session | null;
};

export function LineChartAndTableOverTime({
  session,
}: Readonly<LineChartAndTableOverTimeProps>) {
  const lineChartOverTimeData = useLineChartOverTimeData(session);
  if (!lineChartOverTimeData) return null;

  const { indicatorMetaData } = lineChartOverTimeData;

  return (
    <StyleChartWrapper>
      <H3>Indicator data over time</H3>
      <TabContainer
        id="lineChartAndTable"
        items={[
          {
            id: 'lineChart',
            title: 'Line chart',
            content: <LineChartOverTime session={session} />,
          },
          {
            id: 'lineChartTable',
            title: 'Table',
            content: <LineChartTableOverTime session={session} />,
          },
        ]}
        footer={<DataSource dataSource={indicatorMetaData?.dataSource} />}
      />
    </StyleChartWrapper>
  );
}
