import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { generateConfidenceIntervalSeries } from '@/lib/chartHelpers/chartHelpers';
import { chartColours } from '@/lib/chartHelpers/colours';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { convertDateToNumber } from '@/lib/timePeriodHelpers/getTimePeriodLabels';
import { SymbolKeyValue } from 'highcharts';

export const chartSymbols: SymbolKeyValue[] = [
  'square',
  'triangle',
  'triangle-down',
  'circle',
  'diamond',
];

function generateSeries(
  xCategoryKeys: number[],
  data: HealthDataForArea,
  symbol: SymbolKeyValue,
  colour: Highcharts.ColorString,
  namePrefix?: string
): Highcharts.SeriesOptionsType {
  return {
    type: 'line',
    name: namePrefix ? `${namePrefix}: ${data.areaName}` : data.areaName,
    data: xCategoryKeys.map((xCategoryKey) => {
      const healthDataPointForYear = data.healthData.find(
        (point) => convertDateToNumber(point.datePeriod?.to) === xCategoryKey
      );

      return [healthDataPointForYear?.value ?? null];
    }),
    connectNulls: true,
    marker: {
      symbol,
    },
    color: colour,
    custom: { areaCode: data.areaCode, xCategoryKeys },
  };
}

export function generateSeriesData(
  xCategoryKeys: number[],
  areasData: HealthDataForArea[],
  englandData?: HealthDataForArea,
  groupData?: HealthDataForArea,
  showConfidenceIntervalsData?: boolean,
  benchmarkToUse?: string
): Highcharts.SeriesOptionsType[] {
  if (englandData && areasData.length === 0) {
    return [
      generateSeries(
        xCategoryKeys,
        englandData,
        'circle',
        GovukColours.DarkGrey
      ),
      generateConfidenceIntervalSeries(
        englandData.areaName,
        xCategoryKeys.map((xCategoryKey) => {
          const healthDataPointForYear = englandData.healthData.find(
            (point) =>
              convertDateToNumber(point.datePeriod?.to) === xCategoryKey
          );

          return [
            healthDataPointForYear?.lowerCi ?? null,
            healthDataPointForYear?.upperCi ?? null,
          ];
        }),
        showConfidenceIntervalsData
      ),
    ];
  }

  const seriesData: Highcharts.SeriesOptionsType[] = areasData
    .toSorted((a, b) => a.areaName.localeCompare(b.areaName))
    .flatMap((item, index) => {
      const lineSeries: Highcharts.SeriesOptionsType = generateSeries(
        xCategoryKeys,
        item,
        chartSymbols[index % chartSymbols.length],
        chartColours[index % chartColours.length]
      );

      const confidenceIntervalSeries: Highcharts.SeriesOptionsType =
        generateConfidenceIntervalSeries(
          item.areaName,
          xCategoryKeys.map((xCategoryKey) => {
            const healthDataPointForYear = item.healthData.find(
              (point) =>
                convertDateToNumber(point.datePeriod?.to) === xCategoryKey
            );

            return [
              healthDataPointForYear?.lowerCi ?? null,
              healthDataPointForYear?.upperCi ?? null,
            ];
          }),
          showConfidenceIntervalsData
        );

      return showConfidenceIntervalsData
        ? [lineSeries, confidenceIntervalSeries]
        : lineSeries;
    });

  const groupBenchmarkSeries = groupData
    ? generateSeries(
        xCategoryKeys,
        groupData,
        'diamond',
        GovukColours.Turquoise,
        'Group'
      )
    : undefined;

  const alternateBenchmarkSeries = englandData
    ? generateSeries(xCategoryKeys, englandData, 'diamond', GovukColours.Pink)
    : undefined;

  if (benchmarkToUse === areaCodeForEngland) {
    if (groupBenchmarkSeries) {
      seriesData.unshift(groupBenchmarkSeries);
    }

    if (englandData) {
      const primaryBenchmarkSeries = generateSeries(
        xCategoryKeys,
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
        xCategoryKeys,
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
