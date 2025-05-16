import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { generateConfidenceIntervalSeries } from '@/lib/chartHelpers/chartHelpers';
import { ChartColours } from '@/lib/chartHelpers/colours';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { SymbolKeyValue } from 'highcharts';

export function generateSeriesData(
  data: HealthDataForArea[],
  symbols: SymbolKeyValue[],
  chartColours: ChartColours[],
  benchmarkData?: HealthDataForArea,
  parentIndicatorData?: HealthDataForArea,
  showConfidenceIntervalsData?: boolean
): Highcharts.SeriesOptionsType[] {
  if (benchmarkData && data.length === 0) {
    return generateSeriesData(
      [benchmarkData],
      ['circle'],
      [GovukColours.DarkGrey],
      undefined,
      undefined,
      showConfidenceIntervalsData
    );
  }

  const seriesData: Highcharts.SeriesOptionsType[] = data
    .toSorted((a, b) => a.areaName.localeCompare(b.areaName))
    .flatMap((item, index) => {
      const lineSeries: Highcharts.SeriesOptionsType = {
        type: 'line',
        name: item.areaName,
        data: item.healthData.map((point) => [point.year, point.value]),
        marker: {
          symbol: symbols[index % symbols.length],
        },
        color: chartColours[index % chartColours.length],
        custom: { areaCode: item.areaCode },
      };

      const confidenceIntervalSeries: Highcharts.SeriesOptionsType =
        generateConfidenceIntervalSeries(
          item.areaName,
          item.healthData.map((point) => [
            point.year,
            point.lowerCi,
            point.upperCi,
          ]),
          showConfidenceIntervalsData
        );

      return showConfidenceIntervalsData
        ? [lineSeries, confidenceIntervalSeries]
        : lineSeries;
    });

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
      custom: { areaCode: parentIndicatorData.areaCode },
    };

    seriesData.unshift(groupSeries);
  }

  if (benchmarkData) {
    const englandSeries: Highcharts.SeriesOptionsType = {
      type: 'line',
      name: `Benchmark: ${benchmarkData.areaName}`,
      data: benchmarkData.healthData.map((point) => [point.year, point.value]),
      color: GovukColours.DarkGrey,
      marker: {
        symbol: 'circle',
      },
      custom: { areaCode: benchmarkData.areaCode },
    };

    seriesData.unshift(englandSeries);
  }

  return seriesData;
}
