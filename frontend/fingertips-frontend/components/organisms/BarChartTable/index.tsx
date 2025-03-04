'use client';

import { Table } from 'govuk-react';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';

type SparklineProps = {
  value: number;
  maxValue: number;
};
interface sampleData {
  text: string;
  value: number;
}
type chartProps = {
  sData: sampleData[]
}

export function Sparkline({ value, maxValue }: Readonly<SparklineProps>) {
  const sparkLineOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },
    chart: { type: 'bar', height: 60, width: 300 },
    title: {
      style: {
        display: 'none',
      },
    },
    yAxis: { visible: false, min: 0, max: maxValue },
    xAxis: { visible: false },
    series: [{ type: 'bar', data: [value]}],
    legend: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
    plotOptions: {
     bar: {
        pointWidth: 20
      }
    },
    tooltip: {
      hideDelay: 0
    }
  };
  
  return (
    <HighchartsReact
      highcharts = { Highcharts }
      options = { sparkLineOptions }
    >
    </HighchartsReact>
);
}

export function BarChartTable({sData}:Readonly<chartProps>) {
  
  const maxValue = Math.max(...sData.map(item => item.value))

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
        <Table.Row key={`sparkline-${data.text}`}>
          <Table.Cell>
            {data.text}
          </Table.Cell>
          <Table.Cell>
            <Sparkline value={data.value} maxValue={maxValue}/>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
}