'use client';

import Highcharts from 'highcharts';
import Heatmap from 'highcharts/modules/heatmap';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { generateHeatmapData } from './heatmapUtil';
import { H3 } from 'govuk-react';

// Initialize the Heatmap module
if (typeof window === 'undefined') {
  Heatmap(Highcharts);
}

export interface IndicatorRowData {
  indicator: string; // For display purposes
  year: number; // To match against the health data in the following array
  rowData: Array<HealthDataForArea>; // Set of health data across set of areas for the indicator above
}

interface HeatmapChartProps {
  areaCodes: Array<string>; // Set of area codes to display the heatmap for (x-axis)
  data: Array<IndicatorRowData>; // Set of indicators to display along with associated indicator data (y-axis)
  accessibilityLabel: string;
}

export function HeatmapChart({
  areaCodes,
  data,
  accessibilityLabel,
}: Readonly<HeatmapChartProps>) {
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
        data: generateHeatmapData(data, areaCodes),
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.value ?? 'X';
          },
          style: {
            fontSize: '20px',
          },
        },
      },
    ],
    yAxis: {
      categories: data.map((i) => i.indicator + '|' + i.year),
      labels: {
        useHTML: true,
        formatter: function () {
          return formatIndicatorLabel(this.value as string);
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
