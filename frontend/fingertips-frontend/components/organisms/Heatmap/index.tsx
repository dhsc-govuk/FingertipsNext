'use client';

import Highcharts from 'highcharts';
import Heatmap from 'highcharts/modules/heatmap';
import { HighchartsReact } from 'highcharts-react-official';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { PointOptionsObject } from 'highcharts';

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
}

export function HeatmapChart({ areaCodes, data }: Readonly<HeatmapChartProps>) {
  const options: Highcharts.Options = {
    title: {
      text: 'Test chart',
    },
    chart: {
      type: 'heatmap',
      height: '50%',
      spacingBottom: 50,
      spacingTop: 20,
      marginLeft: 200,
    },
    series: [
      {
        type: 'heatmap',
        name: 'Heatmap',
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
  };

  return (
    <div data-testid="heatmapChart-component">
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
  return `<a href='/'>${indicator}</a> ${year}`;
}

function generateHeatmapData(
  data: Array<IndicatorRowData>,
  areaCodes: Array<string>
): Array<PointOptionsObject> {
  const heatmapData: Array<PointOptionsObject> = [];
  let areaColumn = 0,
    indicatorRow = 0;
  for (const indicatorData of data) {
    for (const areaCode of areaCodes) {
      const pointData: PointOptionsObject = {
        x: areaColumn,
        y: indicatorRow,
        value: getValueForAreaCode(areaCode, indicatorData),
      };
      heatmapData.push(pointData);
      areaColumn++;
    }
    indicatorRow++;
    areaColumn = 0;
  }
  return heatmapData;
}

function getValueForAreaCode(
  areaCode: string,
  indicatorRowData: IndicatorRowData
): number | null {
  let result = null;
  for (const healthDataForArea of indicatorRowData.rowData) {
    if (healthDataForArea.areaCode === areaCode) {
      for (const dataPoint of healthDataForArea.healthData) {
        if (dataPoint.year === indicatorRowData.year) {
          result = dataPoint.value;
          break;
        }
      }
      break;
    }
  }
  return result;
}
