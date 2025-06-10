import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataPoint,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import {
  extractSortedAreasIndicatorsAndDataPoints,
  generateHeaders,
  generateRows,
  HeaderType,
} from './heatmapUtil';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';

describe('generate headers and rows - benchmark area is England', () => {
  const groupAreaCode = 'groupAreaCode';
  const sortedAreas = [
    { code: areaCodeForEngland, name: 'England' },
    { code: groupAreaCode, name: 'Group Area' },
    { code: 'generic code', name: 'Generic Area' },
  ];

  const sortedIndicators = [
    {
      id: '1',
      name: 'Indicator 1',
      unitLabel: 'per 100',
      latestDataPeriod: 1234,
      benchmarkMethod: BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      polarity: IndicatorPolarity.HighIsGood,
    },
    {
      id: '2',
      name: 'Indicator 2',
      unitLabel: 'per 1,000',
      latestDataPeriod: 5678,
      benchmarkMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
      polarity: IndicatorPolarity.LowIsGood,
    },
  ];

  const missingDataPoint = {
    areaCode: sortedAreas[2].code,
    indicatorId: sortedIndicators[1].id,
  };

  interface DataPoint {
    value?: number;
    areaCode: string;
    indicatorId: string;
  }

  const dataPoints: Record<string, Record<string, DataPoint>> = {};
  sortedIndicators.forEach((indicator, indicatorIndex) => {
    dataPoints[indicator.id] = {};
    sortedAreas.forEach((area, areaIndex) => {
      if (
        !(
          indicator.id === missingDataPoint.indicatorId &&
          area.code === missingDataPoint.areaCode
        )
      ) {
        dataPoints[indicator.id][area.code] = {
          value: areaIndex + indicatorIndex * 10,
          indicatorId: indicator.id,
          areaCode: area.code,
        };
      }
    });
  });

  const headers = generateHeaders(
    sortedAreas,
    groupAreaCode,
    areaCodeForEngland
  );

  const rows = generateRows(
    sortedAreas,
    sortedIndicators,
    dataPoints,
    groupAreaCode,
    areaCodeForEngland
  );

  it('should set the first header to indicator title header', () => {
    expect(headers[0].type).toEqual(HeaderType.IndicatorTitle);
    expect(headers[0].content).toEqual('Indicators');
  });

  it('should set the second header to period header', () => {
    expect(headers[1].type).toEqual(HeaderType.Period);
    expect(headers[1].content).toEqual('Period');
  });

  it('should set the third header to value unit header', () => {
    expect(headers[2].type).toEqual(HeaderType.ValueUnit);
    expect(headers[2].content).toEqual('Value unit');
  });

  it('should set the header corresponding to the benchmark area (england) to benchmark header type', () => {
    expect(headers[3].type).toEqual(HeaderType.BenchmarkGroupArea);
    expect(headers[3].content).toEqual('Benchmark: England');
  });

  it('should set the header corresponding to the group area to group area header type', () => {
    expect(headers[4].type).toEqual(HeaderType.NonBenchmarkGroupArea);
    expect(headers[4].content).toEqual('Group: Group Area');
  });

  it('should set the header corresponding to an area) to area header type', () => {
    expect(headers[5].type).toEqual(HeaderType.Area);
    expect(headers[5].content).toEqual('Generic Area');
  });

  it('should prefix each row with the correct indicator title', () => {
    expect(rows[0].cells[0].content).toEqual(sortedIndicators[0].name);
    expect(rows[1].cells[0].content).toEqual(sortedIndicators[1].name);
  });

  it('should prefix each row with the correct unit label', () => {
    expect(rows[0].cells[2].content).toEqual(sortedIndicators[0].unitLabel);
    expect(rows[1].cells[2].content).toEqual(sortedIndicators[1].unitLabel);
  });

  it('should prefix each row with the correct data period', () => {
    expect(rows[0].cells[1].content).toEqual(
      sortedIndicators[0].latestDataPeriod.toString()
    );
    expect(rows[1].cells[1].content).toEqual(
      sortedIndicators[1].latestDataPeriod.toString()
    );
  });

  it('should lay out data points in the correct order', () => {
    expect(rows[0].cells[3].content).toEqual('0.0');
    expect(rows[0].cells[4].content).toEqual('1.0');
    expect(rows[0].cells[5].content).toEqual('2.0');

    expect(rows[1].cells[3].content).toEqual('10.0');
    expect(rows[1].cells[4].content).toEqual('11.0');
    expect(rows[1].cells[5].content).toEqual('X');
  });

  it('should not populate hover properties on non-data cells', () => {
    expect(rows[0].cells[0].hoverProps).toBeUndefined();
    expect(rows[0].cells[1].hoverProps).toBeUndefined();
    expect(rows[0].cells[2].hoverProps).toBeUndefined();

    expect(rows[1].cells[0].hoverProps).toBeUndefined();
    expect(rows[1].cells[1].hoverProps).toBeUndefined();
    expect(rows[1].cells[2].hoverProps).toBeUndefined();
  });

  it('should populate hover properties on data cells', () => {
    expect(rows[0].cells[3].hoverProps).not.toBeUndefined();
    expect(rows[0].cells[4].hoverProps).not.toBeUndefined();
    expect(rows[0].cells[5].hoverProps).not.toBeUndefined();

    expect(rows[1].cells[3].hoverProps).not.toBeUndefined();
    expect(rows[1].cells[4].hoverProps).not.toBeUndefined();
    expect(rows[1].cells[5].hoverProps).not.toBeUndefined();
  });
});

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
