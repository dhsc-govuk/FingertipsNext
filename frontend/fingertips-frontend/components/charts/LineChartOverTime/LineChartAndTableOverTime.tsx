import { H3 } from 'govuk-react';
import { TabContainer } from '@/components/layouts/tabContainer';
import { DataSource } from '@/components/atoms/DataSource/DataSource';
import { StyleChartWrapper } from '@/components/styles/viewPlotStyles/styleChartWrapper';
import { useLineChartOverTimeData } from '@/components/charts/LineChartOverTime/hooks/useLineChartOverTimeData';
import { LineChartOverTime } from '@/components/charts/LineChartOverTime/LineChartOverTime';
import { LineChartTableOverTime } from '@/components/charts/LineChartOverTime/LineChartTableOverTime';
import { LineChartOverTimeSegmentationOptions } from '@/components/charts/LineChartOverTime/LineChartOverTimeSegmentationOptions';

export function LineChartAndTableOverTime() {
  const lineChartOverTimeData = useLineChartOverTimeData();
  if (!lineChartOverTimeData) return null;

  const { indicatorMetaData } = lineChartOverTimeData;

  return (
    <div>
      <LineChartOverTimeSegmentationOptions />
      <StyleChartWrapper>
        <H3>Indicator data over time</H3>
        <TabContainer
          id="lineChartAndTable"
          items={[
            {
              id: 'lineChart',
              title: 'Line chart',
              content: <LineChartOverTime />,
            },
            {
              id: 'lineChartTable',
              title: 'Table',
              content: <LineChartTableOverTime />,
            },
          ]}
          footer={<DataSource dataSource={indicatorMetaData?.dataSource} />}
        />
      </StyleChartWrapper>
    </div>
  );
}
