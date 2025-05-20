import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { generateConfidenceIntervalSeries } from '@/lib/chartHelpers/chartHelpers';
import { chartColours } from '@/lib/chartHelpers/colours';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { SymbolKeyValue } from 'highcharts';

export const chartSymbols: SymbolKeyValue[] = [
  'square',
  'triangle',
  'triangle-down',
  'circle',
  'diamond',
];

function generateSeries(
  data: HealthDataForArea,
  symbol: SymbolKeyValue,
  colour: Highcharts.ColorString,
  namePrefix?: string
): Highcharts.SeriesOptionsType {
  return {
    type: 'line',
    name: namePrefix ? `${namePrefix}: ${data.areaName}` : data.areaName,
    data: data.healthData.map((point) => [point.year, point.value]),
    marker: {
      symbol,
    },
    color: colour,
    custom: { areaCode: data.areaCode },
  };
}

export function generateSeriesData(
  areasData: HealthDataForArea[],
  englandData?: HealthDataForArea,
  groupData?: HealthDataForArea,
  showConfidenceIntervalsData?: boolean,
  benchmarkToUse?: string
): Highcharts.SeriesOptionsType[] {
  if (englandData && areasData.length === 0) {
    return [generateSeries(englandData, 'circle', GovukColours.DarkGrey)];
  }

  const seriesData: Highcharts.SeriesOptionsType[] = areasData
    .toSorted((a, b) => a.areaName.localeCompare(b.areaName))
    .flatMap((item, index) => {
      const lineSeries: Highcharts.SeriesOptionsType = generateSeries(
        item,
        chartSymbols[index % chartSymbols.length],
        chartColours[index % chartColours.length]
      );

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

  const groupBenchmarkSeries = groupData
    ? generateSeries(groupData, 'diamond', GovukColours.Turquoise, 'Group')
    : undefined;

  const alternateBenchmarkSeries = englandData
    ? generateSeries(englandData, 'diamond', GovukColours.Pink)
    : undefined;

  if (benchmarkToUse === areaCodeForEngland) {
    if (groupBenchmarkSeries) {
      seriesData.unshift(groupBenchmarkSeries);
    }

    if (englandData) {
      const primaryBenchmarkSeries = generateSeries(
        englandData,
        'circle',
        GovukColours.DarkGrey,
        'Benchmark'
      );
      seriesData.unshift(primaryBenchmarkSeries);
    }
  } else {
    if (alternateBenchmarkSeries) {
      seriesData.unshift(alternateBenchmarkSeries);
    }

    if (groupData) {
      const primaryBenchmarkSeries = generateSeries(
        groupData,
        'circle',
        GovukColours.DarkGrey,
        'Benchmark'
      );
      seriesData.unshift(primaryBenchmarkSeries);
    }
  }

  return seriesData;
}
