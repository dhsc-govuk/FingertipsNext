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
        animation: false,
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
        animation: false,
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
      animation: false,
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
      animation: false,
    };
    seriesData.unshift(englandSeries);
  }

  return seriesData;
}

export function shouldDisplayLineChart(
  data: HealthDataForArea[],
  indicatorsSelected: string[] = [],
  areasSelected: string[] = []
): boolean {
  return (
    indicatorsSelected.length === 1 &&
    areasSelected.length > 0 &&
    areasSelected.length <= 2 &&
    data[0]?.healthData.length > 1
  );
}
