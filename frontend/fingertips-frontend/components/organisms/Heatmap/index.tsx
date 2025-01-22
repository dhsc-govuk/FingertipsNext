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

interface HeatmapDisplayObject extends PointOptionsObject {
  displayValue: string;
}

export interface IndicatorRowData {
  indicator: string; // For display purposes
  year: number; // To match against the health data in the following array
  rowData: Array<HealthDataForArea>; // Set of health data across set of areas for the indicator above
}

interface HeatmapChartProps {
  areaCodes: Array<string>; // Set of area codes to display the heatmap for (x-axis)
  data: Array<IndicatorRowData>; // Set of indicators to display along with associated indicator data (y-axis)
};


export function HeatmapChart({
  areaCodes,
  data,
}: Readonly<HeatmapChartProps>) {

  const options: Highcharts.Options = {
    title: {
        text: 'Test chart'
    },
    chart: { type: 'heatmap', height: '50%', spacingBottom: 50, spacingTop: 20 },
    series: [{
      type: 'heatmap',
      name: 'Heatmap',
      borderWidth: 1, 
      data: generateHeatmapData(data, areaCodes),
    }]
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

function generateHeatmapData(data: Array<IndicatorRowData>, areaCodes: Array<string>) : Array<HeatmapDisplayObject>
{
  const heatmapData: Array<HeatmapDisplayObject> = [];
  for (const indicatorData of data) {
    for (const areaCode of areaCodes) {
      heatmapData.push(getValueForAreaCode(areaCode, indicatorData));
    }
  }
  console.log('***** Heatmap:');
  console.log(heatmapData);
  return heatmapData;
}

function getValueForAreaCode(areaCode: string, indicatorRowData: IndicatorRowData) : HeatmapDisplayObject {
  const result: HeatmapDisplayObject = { displayValue: 'X' }; // The 'X' represents no available data for the specified area code and year.
  for (const healthDataForArea of indicatorRowData.rowData) {
    if (healthDataForArea.areaCode === areaCode) {
      for (const dataPoint of healthDataForArea.healthData) {
        if (dataPoint.year === indicatorRowData.year) {
          result.displayValue = dataPoint.value.toString();
          break;
        }
      }
      break;
    }
  }
  return result;
}