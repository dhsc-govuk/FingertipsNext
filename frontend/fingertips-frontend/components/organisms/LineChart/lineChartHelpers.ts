import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import Highcharts, { SymbolKeyValue } from 'highcharts';
import { ChartColours } from '@/lib/chartHelpers/colours';
import { GovukColours } from '@/lib/styleHelpers/colours';

export function generateSeriesData(
  data: HealthDataForArea[],
  symbols: SymbolKeyValue[],
  chartColours: ChartColours[],
  benchmarkData?: HealthDataForArea,
  parentIndicatorData?: HealthDataForArea,
  showConfidenceIntervalsData?: boolean
) {
  const seriesData: Highcharts.SeriesOptionsType[] = data.flatMap(
    (item, index) => {
      const lineSeries: Highcharts.SeriesOptionsType = {
        type: 'line',
        name: `${item.areaName}`,
        data: item.healthData.map((point) => [point.year, point.value]),
        marker: {
          symbol: symbols[index % symbols.length],
        },
        color: chartColours[index % chartColours.length],
      };

      const confidenceIntervalSeries: Highcharts.SeriesOptionsType = {
        type: 'errorbar',
        name: `${item.areaName}`,
        data: item.healthData.map((point) => [
          point.year,
          point.lowerCi,
          point.upperCi,
        ]),
        visible: showConfidenceIntervalsData,
        color: GovukColours.MidGrey,
        whiskerLength: '20%',
        lineWidth: 2,
      };

      return [lineSeries, confidenceIntervalSeries];
    }
  );

  if (parentIndicatorData) {
    const groupSeries: Highcharts.SeriesOptionsType = {
      type: 'line',
      name: `Group: ${parentIndicatorData.areaName}`,
      data: parentIndicatorData.healthData.map((point) => [
        point.year,
        point.value,
      ]),
      color: GovukColours.Turquoise,
      marker: {
        symbol: 'diamond',
      },
    };
    seriesData.unshift(groupSeries);
  }

  if (benchmarkData) {
    const englandSeries: Highcharts.SeriesOptionsType = {
      type: 'line',
      name: `Benchmark: ${benchmarkData.areaName}`,
      data: benchmarkData.healthData.map((point) => [point.year, point.value]),
      color: GovukColours.Black,
      marker: {
        symbol: 'circle',
      },
    };
    seriesData.unshift(englandSeries);
  }

  return seriesData;
}
