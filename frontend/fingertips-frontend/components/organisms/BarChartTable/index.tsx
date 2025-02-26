'use client';

import { Table } from 'govuk-react';
// import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { HighchartsReact } from 'highcharts-react-official';
import Highcharts from 'highcharts';

type ChartProps = {
  data: sampleData[];
};

interface sampleData {
  row1: 'text';
  value1: [1, 3, 3];
  row2: 'text';
  value2: [1, 5, 3];
  row3: 'text';
  value3: [1, 2, 3, 4];
}

export function BarChartTable({ data }: Readonly<ChartProps>) {
  const sparkLineOptions: Highcharts.Options = {
    chart: { type: 'bar' },
    title: { text: 'Sparkline chart' },
    yAxis: { visible: false },
    xAxis: { visible: false },
    series: [{ type: 'bar', data: [data] }],
  };

  return (
    <Table id={'test-sparkline'} head={<Table.Row>Heading one</Table.Row>}>
      <Table.Row>
        <HighchartsReact
          highcharts={Highcharts}
          options={sparkLineOptions}
        ></HighchartsReact>
      </Table.Row>
    </Table>
  );
}
