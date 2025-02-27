'use client';

import { Table } from 'govuk-react';
// import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { HighchartsReact } from 'highcharts-react-official';
import Highcharts from 'highcharts';


type chartProps = {
  sData: sampleData[]
}
interface sampleData {
  text: string;
  value: number;
};

export function BarChartTable({ sData }: Readonly<chartProps>) {
  const sparkLineOptions: Highcharts.Options = {
    chart: { type: 'bar' },
    title: {
      style: {
        display: 'none',
      }
    },
    yAxis: { visible: false },
    xAxis: { visible: false },
    series: [{ type: 'bar', data: [sData] }],
  };

  return (
    <Table id={'test-sparkline'} head={ 
     <Table.Row><Table.CellHeader>Sparkline</Table.CellHeader></Table.Row>
    }>
        {sData.map((data, index) => (
          <><Table.Row key={index}>
            <HighchartsReact
              highcharts={Highcharts}
              options={sparkLineOptions}
            ></HighchartsReact>
          </Table.Row>
          </>
        ))}
    </Table>
  );
}
