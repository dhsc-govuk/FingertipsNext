'use client';

import Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { generateHeatmapData } from './heatmapUtil';
import { H3 } from 'govuk-react';
import { useEffect, useState } from 'react';

export interface IndicatorRowData {
  indicator: string; // For display purposes
  year: number; // To match against the health data in the following array
  rowData: Array<HealthDataForArea>; // Set of health data across set of areas for the indicator above
}

interface HeatmapChartProps {
  accessibilityLabel: string;
}

// Temporary test data for Heatmap
const areaCodes: Array<string> = ['a1', 'a2', 'a3'];
const heatmapData: Array<IndicatorRowData> = [
  {
    indicator: 'Indicator1',
    year: 2023,
    rowData: [
      {
        areaCode: 'a1',
        areaName: 'area1',
        healthData: [
          {
            year: 2023,
            count: 3,
            value: 27,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
          },
        ],
      },
    ],
  },
  {
    indicator: 'Indicator2',
    year: 2024,
    rowData: [
      {
        areaCode: 'a1',
        areaName: 'area1',
        healthData: [
          {
            year: 2023,
            count: 5,
            value: 33,
            upperCi: 18,
            lowerCi: 9,
            ageBand: 'ageBand',
            sex: 'M',
          },
          {
            year: 2024,
            count: 13,
            value: 11,
            upperCi: 23,
            lowerCi: 3,
            ageBand: 'ageBand',
            sex: 'M',
          },
        ],
      },
      {
        areaCode: 'a2',
        areaName: 'area2',
        healthData: [
          {
            year: 2019,
            count: 3,
            value: 27,
            upperCi: 8,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
          },
          {
            year: 2024,
            count: 9,
            value: 82,
            upperCi: 99,
            lowerCi: 2,
            ageBand: 'ageBand',
            sex: 'M',
          },
        ],
      },
    ],
  },
];

export function HeatmapChart({
  accessibilityLabel,
}: Readonly<HeatmapChartProps>) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize the Heatmap module
    if (typeof window !== 'undefined') {
      import('highcharts/modules/heatmap').then(() => {
        setIsReady(true);
      });
    }
  }, []);

  if (!isReady) return null;

  const options: Highcharts.Options = {
    title: {
      text: 'Heatmap Chart Title',
      style: {
        display: 'none',
      },
    },
    chart: {
      type: 'heatmap',
      height: '50%',
      spacingBottom: 50,
      spacingTop: 20,
      marginLeft: 300,
    },
    series: [
      {
        type: 'heatmap',
        name: 'Heatmap Series',
        borderWidth: 1,
        data: generateHeatmapData(heatmapData, areaCodes),
        dataLabels: {
          enabled: true,
          formatter: function () {
            const context = { ...this };
            return context.value ?? 'X';
          },
          style: {
            fontSize: '20px',
          },
        },
      },
    ],
    yAxis: {
      categories: heatmapData.map((i) => i.indicator + '|' + i.year),
      labels: {
        useHTML: true,
        formatter: function () {
          const context = { ...this };
          return formatIndicatorLabel(context.value as string);
        },
        style: {
          fontSize: '20px',
          wordBreak: 'break-none',
        },
      },
      title: undefined,
    },
    xAxis: {
      categories: areaCodes,
      opposite: true,
      labels: {
        rotation: -60,
        style: {
          fontSize: '20px',
        },
      },
    },
    accessibility: {
      enabled: false,
      description: accessibilityLabel,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div data-testid="heatmapChart-component">
      <H3>Heatmap Chart Title</H3>
      <HighchartsReact
        containerProps={{ 'data-testid': 'highcharts-react-component' }}
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
}

function formatIndicatorLabel(label: string): string {
  const [indicator, year] = label.split('|');
  return `<table width='250px'><tr><td><a href='/'>${indicator}</a></td><td>${year}</td></tr></table>`;
}
