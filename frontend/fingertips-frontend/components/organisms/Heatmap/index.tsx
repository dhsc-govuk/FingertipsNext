'use client';

import { HealthDataPoint } from '@/generated-sources/ft-api-client';
import { GovukColours } from '@/lib/styleHelpers/colours';
import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { IndicatorData } from './heatmapUtil';
interface HeatmapProps {
  indicatorData: IndicatorData[];
}

const formatTooltip = (
  areaName: string,
  indicatorName: string,
  value: string,
  unitValue: string
): string => {
  return `<b>${areaName}</b></br>${indicatorName}</br>${formatValue(value, unitValue)}`;
};

const formatValue = (value: string, unitValue: string) => {
  return unitValue === '%' ? `${value}${unitValue}` : `${value} ${unitValue}`;
};

interface chartItem {
  x: number;
  y: number;

  dataPoint: HealthDataPoint;
}

function generateChartData(): void {
  return;
}

export function Heatmap({}: Readonly<HeatmapProps>) {
  const [options, setOptions] = useState<Highcharts.Options>();
  const loadHighchartsModules = async (callback: () => void) => {
    await import('highcharts/modules/heatmap').then(callback);
  };

  const heatmapOptions: Highcharts.Options = {
    credits: {
      enabled: false,
    },

    chart: { type: 'heatmap', plotBorderWidth: 1 },

    title: { style: { display: 'none' } },

    xAxis: {
      categories: ['1', '2', '3'],
      opposite: true,
    },
    yAxis: {
      categories: ['A', 'B', 'C'],
      reversed: true,
      title: undefined,
      //labels: { format: '{substr value 0 1}' },
    },

    tooltip: {
      format:
        '<b>{series.xAxis.categories.(point.x)}</b><br>{series.yAxis.categories.(point.y)}',
    },

    // DATA FORMAT - [xCoord, yCoord, Value]
    series: [
      {
        name: 'Series Name!',
        borderWidth: 1,
        nullColor: GovukColours.White,
        data: [
          [0, 0, 'Foo'],
          [0, 1, 1],
          [0, 2, 2],
          [1, 0, 3],
          [1, 1, 4],
          [1, 2, 5],
          [2, 0, 6],
          [2, 1, 7],
          [2, 2, 8],
        ],
        dataLabels: {
          enabled: true,
          color: '#000000',
        },
        type: 'heatmap',
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
        },
      ],
    },

    legend: {},
  };

  useEffect(() => {
    loadHighchartsModules(() => {
      setOptions(heatmapOptions);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!options) {
    return null;
  }

  return (
    <div data-testid="heatmap-component">
      <HighchartsReact
        containerProps={{ 'data-testid': 'highcharts-react-component-heatmap' }}
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
}
