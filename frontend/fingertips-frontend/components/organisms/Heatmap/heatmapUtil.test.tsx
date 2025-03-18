import { HealthDataPoint } from '@/generated-sources/ft-api-client';
import {
  area,
  DataPoint,
  extractAreasIndicatorsAndDataPoints,
  indicator,
  IndicatorData,
  orderAreaByNameWithSomeCodesInFront,
  orderIndicatorsByName,
} from './heatmapUtil';

describe('extract areas, indicators, and data points', () => {
  const newHealthDataPoint = ({
    year,
    value,
  }: {
    year: number;
    value?: number;
  }): HealthDataPoint => {
    return {
      year: year,
      value: value,
      ageBand: '',
      sex: '',
      trend: 'Not yet calculated',
    };
  };

  // one test to rule them all etc
  // this is a bit of a bodge
  const indicator1: indicator = { id: 'indicator1', name: '', unitLabel: '' };
  const indicator2: indicator = { id: 'indicator2', name: '', unitLabel: '' };

  const area1: area = { code: 'area1', name: '' };
  const area2: area = { code: 'area2', name: '' };
  const area3: area = { code: 'area3', name: '' };

  const data: HealthDataPoint[][][] = [
    [
      [
        newHealthDataPoint({ year: 1, value: 11 }),
        newHealthDataPoint({ year: 2, value: 12 }),
      ],
      [
        newHealthDataPoint({ year: 1, value: 21 }),
        newHealthDataPoint({ year: 2, value: 22 }),
      ],
      [
        newHealthDataPoint({ year: 1, value: 31 }),
        newHealthDataPoint({ year: 2, value: 32 }),
      ],
    ],
    [
      [
        newHealthDataPoint({ year: 1, value: 111 }),
        newHealthDataPoint({ year: 2, value: 112 }),
      ],
      [newHealthDataPoint({ year: 1, value: 121 })],
      [
        newHealthDataPoint({ year: 1, value: 131 }),
        newHealthDataPoint({ year: 2, value: 132 }),
      ],
    ],
  ];

  const initialData: IndicatorData[] = [
    {
      indicatorId: indicator1.id,
      indicatorName: indicator1.name,
      unitLabel: '',
      healthDataForAreas: [
        {
          areaCode: area1.code,
          areaName: area1.name,
          healthData: data[0][0],
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
      ],
    },
    {
      indicatorId: indicator2.id,
      indicatorName: indicator2.name,
      unitLabel: '',
      healthDataForAreas: [
        {
          areaCode: area1.code,
          areaName: area1.name,
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
      ],
    },
  ];

  const expectedAreas: Record<string, area> = { area1, area2, area3 };
  const expectedIndicators: Record<string, indicator> = {
    indicator1,
    indicator2,
  };
  const expectedDataPoints: DataPoint[] = [
    {
      areaCode: area1.code,
      indicatorId: indicator1.id,
      value: data[0][0][1].value,
    },
    {
      areaCode: area2.code,
      indicatorId: indicator1.id,
      value: data[0][1][1].value,
    },
    {
      areaCode: area3.code,
      indicatorId: indicator1.id,
      value: data[0][2][1].value,
    },
    {
      areaCode: area1.code,
      indicatorId: indicator2.id,
      value: data[1][0][1].value,
    },
    {
      areaCode: area2.code,
      indicatorId: indicator2.id,
      value: undefined,
    },
    {
      areaCode: area3.code,
      indicatorId: indicator2.id,
      value: data[1][2][1].value,
    },
  ];

  const { areas, indicators, dataPoints } =
    extractAreasIndicatorsAndDataPoints(initialData);

  it('should populate areas with the correct information', () => {
    expect(areas).toEqual(expectedAreas);
  });

  it('should populate indicators with the correct information', () => {
    expect(indicators).toEqual(expectedIndicators);
  });

  it('should populate data points with the correct information', () => {
    expect(dataPoints).toEqual(expectedDataPoints);
  });
});

describe('order indicators by name', () => {
  it('should attach position to indicators in alphabetical order', () => {
    const initialIndicators: Record<string, indicator> = {
      '1': {
        id: '1',
        name: 'Maurice M. Mouse',
        unitLabel: '',
      },
      '2': {
        id: '2',
        name: 'Aaron A. Aadvark',
        unitLabel: '',
      },
      '3': {
        id: '3',
        name: 'Zara Z. Zebra',
        unitLabel: '',
      },
    };
    const indicatorsWithPositions = orderIndicatorsByName(initialIndicators);

    expect(indicatorsWithPositions['1'].position).toEqual(1);
    expect(indicatorsWithPositions['2'].position).toEqual(0);
    expect(indicatorsWithPositions['3'].position).toEqual(2);
  });
});

describe('order areas by name', () => {
  it('should attach position to areas in alphabetical order', () => {
    const initialAreas: Record<string, area> = {
      '1': { code: '1', name: 'North Foobar' },
      '2': { code: '2', name: 'South Foobar' },
      '3': { code: '3', name: 'East Foobar' },
      '4': { code: '4', name: 'West Foobar' },
    };

    const areasWithPositions = orderAreaByNameWithSomeCodesInFront(
      initialAreas,
      []
    );

    expect(areasWithPositions['1'].position).toEqual(1);
    expect(areasWithPositions['2'].position).toEqual(2);
    expect(areasWithPositions['3'].position).toEqual(0);
    expect(areasWithPositions['4'].position).toEqual(3);
  });

  it('should precede the main list with given areas', () => {
    const initialAreas: Record<string, area> = {
      '1': { code: '1', name: 'North Foobar' },
      '2': { code: '2', name: 'South Foobar' },
      '3': { code: '3', name: 'East Foobar' },
      '4': { code: '4', name: 'West Foobar' },
    };

    const areasWithPositions = orderAreaByNameWithSomeCodesInFront(
      initialAreas,
      ['4']
    );

    expect(areasWithPositions['1'].position).toEqual(2);
    expect(areasWithPositions['2'].position).toEqual(3);
    expect(areasWithPositions['3'].position).toEqual(1);
    expect(areasWithPositions['4'].position).toEqual(0);
  });
});
