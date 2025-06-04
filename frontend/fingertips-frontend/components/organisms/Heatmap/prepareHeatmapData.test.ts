import {
  BenchmarkOutcome,
  HealthDataPoint,
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { allAgesAge, personsSex, noDeprivation } from '@/lib/mocks';
import { extractSortedAreasIndicatorsAndDataPoints } from './prepareHeatmapData';

export const placeholderGroupAreaCode = 'area3';

const newHealthDataPoint = ({
  year,
  value,
  outcome,
}: {
  year: number;
  value?: number;
  outcome?: BenchmarkOutcome;
}): HealthDataPoint => {
  return {
    year: year,
    value: value,
    ageBand: allAgesAge,
    sex: personsSex,
    trend: 'Not yet calculated',
    deprivation: noDeprivation,
    benchmarkComparison: { outcome: outcome },
  };
};

const indicator1 = {
  id: 'indicator1',
  name: 'Very Verbose Indicator Name With an Extreeeeeeeme Number of Words to Try And Trip Up The View. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus varius magna massa, commodo consectetur erat hendrerit id. In semper, nibh eu efficitur sagittis, quam lectus semper augue, quis vestibulum ipsum urna ut orci.',
  unitLabel: 'per 1,000',
  latestDataPeriod: 2004,
  benchmarkMethod: BenchmarkComparisonMethod.Quintiles,
  polarity: IndicatorPolarity.NoJudgement,
};

const indicator2 = {
  id: 'indicator2',
  name: 'Rate of walkers tripping over sheep',
  unitLabel: 'per 100',
  latestDataPeriod: 2002,
  benchmarkMethod: BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
  polarity: IndicatorPolarity.LowIsGood,
};
const indicator3 = {
  id: 'indicator3',
  name: 'Donkey / Goose ratio',
  unitLabel: '%',
  latestDataPeriod: 2002,
  benchmarkMethod: BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
  polarity: IndicatorPolarity.HighIsGood,
};

const areaEngland = { code: 'E92000001', name: 'England' };
const area2 = { code: 'area2', name: 'Garsdale' };
const area3 = { code: placeholderGroupAreaCode, name: 'Dentdale' };
const area4 = {
  code: 'area4',
  name: 'Comedically Long Area Name with a Devilishly Difficult Distance to Display',
};

const data: HealthDataPoint[][][] = [
  [
    [
      newHealthDataPoint({ year: 2001, value: 11 }),
      newHealthDataPoint({ year: 2000, value: 12 }),
    ],
    [
      newHealthDataPoint({ year: 2002, value: 21 }),
      newHealthDataPoint({ year: 2000, value: 22 }),
    ],
    [
      newHealthDataPoint({ year: 2003, value: 31 }),
      newHealthDataPoint({ year: 2000, value: 32 }),
    ],
    [
      newHealthDataPoint({ year: 2004, value: 41 }),
      newHealthDataPoint({ year: 2000, value: 42 }),
    ],
  ],
  [
    [
      newHealthDataPoint({ year: 2001, value: 111 }),
      newHealthDataPoint({ year: 2002, value: 112 }),
    ],
    [newHealthDataPoint({ year: 2001, value: 121 })],
    [
      newHealthDataPoint({ year: 2001, value: 131 }),
      newHealthDataPoint({ year: 2002, value: 132 }),
    ],
    [
      newHealthDataPoint({ year: 2001, value: 141 }),
      newHealthDataPoint({ year: 2002, value: 142 }),
    ],
  ],
  [
    [
      newHealthDataPoint({ year: 2001, value: 1111 }),
      newHealthDataPoint({ year: 2002, value: 1112 }),
    ],
    [
      newHealthDataPoint({ year: 2001, value: 1121 }),
      newHealthDataPoint({ year: 2002, value: 1122 }),
    ],
    [
      newHealthDataPoint({ year: 2001, value: 1231 }),
      newHealthDataPoint({ year: 2002, value: 1132 }),
    ],
    [
      newHealthDataPoint({ year: 2001, value: 1141 }),
      newHealthDataPoint({ year: 2002, value: 1142 }),
    ],
  ],
];

export const placeholderHeatmapIndicatorData = [
  {
    indicatorId: indicator1.id,
    indicatorName: indicator1.name,
    unitLabel: indicator1.unitLabel,
    healthDataForAreas: [
      {
        areaCode: areaEngland.code,
        areaName: areaEngland.name,
        healthData: data[0][0],
        benchmarkComparison: { benchmarkAreaCode: areaCodeForEngland },
      },
      {
        areaCode: area2.code,
        areaName: area2.name,
        healthData: data[0][1],
      },
      {
        areaCode: area3.code,
        areaName: area3.name,
        healthData: data[0][2],
      },
      {
        areaCode: area4.code,
        areaName: area4.name,
        healthData: data[0][3],
      },
    ],
    benchmarkComparisonMethod: indicator1.benchmarkMethod,
    polarity: indicator1.polarity,
  },
  {
    indicatorId: indicator2.id,
    indicatorName: indicator2.name,
    unitLabel: indicator2.unitLabel,
    healthDataForAreas: [
      {
        areaCode: areaEngland.code,
        areaName: areaEngland.name,
        healthData: data[1][0],
      },
      {
        areaCode: area2.code,
        areaName: area2.name,
        healthData: data[1][1],
      },
      {
        areaCode: area3.code,
        areaName: area3.name,
        healthData: data[1][2],
      },
      {
        areaCode: area4.code,
        areaName: area4.name,
        healthData: data[1][3],
      },
    ],
    benchmarkComparisonMethod: indicator2.benchmarkMethod,
    polarity: indicator2.polarity,
  },
  {
    indicatorId: indicator3.id,
    indicatorName: indicator3.name,
    unitLabel: indicator3.unitLabel,
    healthDataForAreas: [
      {
        areaCode: areaEngland.code,
        areaName: areaEngland.name,
        healthData: data[2][0],
      },
      {
        areaCode: area2.code,
        areaName: area2.name,
        healthData: data[2][1],
      },
      {
        areaCode: area3.code,
        areaName: area3.name,
        healthData: data[2][2],
      },
      {
        areaCode: area4.code,
        areaName: area4.name,
        healthData: data[2][3],
      },
    ],
    benchmarkComparisonMethod: indicator3.benchmarkMethod,
    polarity: indicator3.polarity,
  },
];

const expectedSortedIndicators = [indicator3, indicator2, indicator1];
const expectedSortedAreas = [areaEngland, area3, area4, area2];

describe('extract sorted areas, indicators, and data points - benchmark area is england', () => {
  const { areas, indicators, dataPoints } =
    extractSortedAreasIndicatorsAndDataPoints(
      placeholderHeatmapIndicatorData,
      placeholderGroupAreaCode,
      areaCodeForEngland
    );

  it('should order areas correctly', () => {
    expect(areas).toEqual(expectedSortedAreas);
  });

  it('should order indicators correctly', () => {
    expect(indicators).toEqual(expectedSortedIndicators);
  });

  it('should only extract data from the most recent period', () => {
    expect(
      dataPoints[indicator1.id][expectedSortedAreas[0].code].value
    ).toBeUndefined();
    expect(
      dataPoints[indicator1.id][expectedSortedAreas[1].code].value
    ).toBeUndefined();
    expect(
      dataPoints[indicator1.id][expectedSortedAreas[2].code].value
    ).toEqual(41);
    expect(
      dataPoints[indicator1.id][expectedSortedAreas[3].code].value
    ).toBeUndefined();
  });

  it('should populate data points with benchmarking information', () => {
    const indicators = [indicator1, indicator2, indicator3];
    indicators.forEach((indicator) => {
      expect(
        dataPoints[indicator.id][expectedSortedAreas[1].code].benchmark
      ).toEqual({
        outcome: BenchmarkOutcome.NotCompared,
        benchmarkMethod: indicator.benchmarkMethod,
        polarity: indicator.polarity,
        benchmarkAreaCode: areaCodeForEngland,
      });
    });
  });

  it('should populate data points with benchmarking information with england as baseline', () => {
    const indicators = [indicator1, indicator2, indicator3];
    indicators.forEach((indicator) => {
      expect(dataPoints[indicator.id][areaCodeForEngland].benchmark).toEqual({
        outcome: 'Baseline',
        benchmarkMethod: indicator.benchmarkMethod,
        polarity: indicator.polarity,
        benchmarkAreaCode: areaCodeForEngland,
      });
    });
  });
});
