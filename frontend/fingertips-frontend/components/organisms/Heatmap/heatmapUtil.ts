import { IndicatorRowData } from '.';
import { PointOptionsObject } from 'highcharts';

export function generateHeatmapData(
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
        // Colour can be set here as required e.g.
        // color:'#FFFF00',
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
  for (const healthDataForArea of indicatorRowData.rowData) {
    if (healthDataForArea.areaCode === areaCode) {
      for (const dataPoint of healthDataForArea.healthData) {
        if (dataPoint.year === indicatorRowData.year) {
          // Coerce undefined to null
          return dataPoint.value !== undefined ? dataPoint.value : null;
        }
      }
      break;
    }
  }
  return null;
}
