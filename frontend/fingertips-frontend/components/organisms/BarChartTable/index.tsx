'use client';

import { Table } from 'govuk-react';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';

type SparklineProps = {
  value: number;
};
interface sampleData {
  text: string;
  value: number;
}
type chartProps = {
  sData: sampleData[]
}
export function Sparkline({ value }: Readonly<SparklineProps>) {
  const sparkLineOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: { type: 'bar', height: 60, width: 500 },
    title: {
      style: {
        display: 'none',
      },
    },
    yAxis: { visible: false },
    xAxis: { visible: false },
    series: [{ type: 'bar', data: [value] }],
    legend: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
  };
  
  return (
    <HighchartsReact
      highcharts = { Highcharts }
      options = { sparkLineOptions }>
    </HighchartsReact>
);
}

export function BarChartTable({sData}:Readonly<chartProps>) {
  return (
    <Table
      id={'test-sparkline'}
      head={
        <Table.Row>
          <Table.CellHeader>heading 1</Table.CellHeader>
          <Table.CellHeader>heading 2</Table.CellHeader>
        </Table.Row>
      }>
      {sData.map(data => (
        <Table.Row>
          <Table.Cell>
            {data.text}
          </Table.Cell>
          <Table.Cell>
            <Sparkline value={data.value}/>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}