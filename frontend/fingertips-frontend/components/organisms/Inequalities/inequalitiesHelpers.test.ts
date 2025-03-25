import {
  HealthDataForArea,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import {
  generateInequalitiesLineChartSeriesData,
  getAggregatePointInfo,
  getBenchmarkData,
  getDynamicKeys,
  getYearDataGroupedByInequalities,
  groupHealthDataByInequalities,
  groupHealthDataByYear,
  InequalitiesBarChartData,
  InequalitiesTableRowData,
  InequalitiesTypes,
  mapToInequalitiesTableData,
  RowDataFields,
  shouldDisplayInequalities,
} from './inequalitiesHelpers';
import { GROUPED_YEAR_DATA } from '@/lib/tableHelpers/mocks';
import { UniqueChartColours } from '@/lib/chartHelpers/colours';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { noDeprivation } from '@/lib/mocks';

const MOCK_INEQUALITIES_DATA: HealthDataForArea = {
  areaCode: 'A1425',
  areaName: 'North FooBar',
  healthData: [
    {
      count: 389,
      lowerCi: 441.69151,
      upperCi: 578.32766,
      value: 278.29134,
      year: 2006,
      sex: 'Persons',
      ageBand: 'All',
      trend: HealthDataPointTrendEnum.NotYetCalculated,
      deprivation: noDeprivation,
    },
    {
      count: 400,
      lowerCi: 443.453,
      upperCi: 470.45543,
      value: 450.5343,
      year: 2006,
      sex: 'Male',
      ageBand: 'All',
      trend: HealthDataPointTrendEnum.NotYetCalculated,
      deprivation: noDeprivation,
    },
    {
      count: 267,
      lowerCi: 441.69151,
      upperCi: 578.32766,
      value: 703.420759,
      year: 2004,
      sex: 'Persons',
      ageBand: 'All',
      trend: HealthDataPointTrendEnum.NotYetCalculated,
      deprivation: noDeprivation,
    },
    {
      count: 300,
      lowerCi: 345.4543,
      upperCi: 400.34234,
      value: 370.34334,
      year: 2004,
      sex: 'Female',
      ageBand: 'All',
      trend: HealthDataPointTrendEnum.NotYetCalculated,
      deprivation: noDeprivation,
    },
  ],
};

const yearlyHealthDataGroupedBySex = {
  2004: {
    Persons: [MOCK_INEQUALITIES_DATA.healthData[2]],
    Female: [MOCK_INEQUALITIES_DATA.healthData[3]],
  },
  2006: {
    Persons: [MOCK_INEQUALITIES_DATA.healthData[0]],
    Male: [MOCK_INEQUALITIES_DATA.healthData[1]],
  },
};

const mockInequalitiesRowData = [
  {
    period: 2004,
    inequalities: {
      Male: {
        value: 703.420759,
        count: 267,
        upper: 578.32766,
        lower: 441.69151,
      },
      Female: {
        value: 703.420759,
        count: 267,
        upper: 578.32766,
        lower: 441.69151,
      },
    },
  },
  {
    period: 2008,
    inequalities: {
      Persons: {
        value: 135.149304,
        count: 222,
        upper: 578.32766,
        lower: 441.69151,
      },
      Male: {
        value: 890.328253,
        count: 131,
        upper: 578.32766,
        lower: 441.69151,
      },
      Female: {
        value: 890.328253,
        count: 131,
        upper: 578.32766,
        lower: 441.69151,
      },
    },
  },
];

describe('should display inequalities', () => {
  describe('should return false', () => {
    it('should return false when multiple indicators are selected', () => {
      expect(shouldDisplayInequalities(['1', '108'], ['A1'])).toBe(false);
    });

    it('should return false when multiple areas are selected', () => {
      expect(shouldDisplayInequalities(['1'], ['A1', 'A2'])).toBe(false);
    });
  });

  describe('should return true', () => {
    it('should return true when a single indicator is selected with a single area', () => {
      expect(shouldDisplayInequalities(['1'], ['A1'])).toBe(true);
    });
  });
});

describe('groupHealthDataByYear', () => {
  it('should group health data by year', () => {
    const healthDataGroupedByYear = {
      2004: [
        MOCK_INEQUALITIES_DATA.healthData[2],
        MOCK_INEQUALITIES_DATA.healthData[3],
      ],
      2006: [
        MOCK_INEQUALITIES_DATA.healthData[0],
        MOCK_INEQUALITIES_DATA.healthData[1],
      ],
    };

    expect(groupHealthDataByYear(MOCK_INEQUALITIES_DATA.healthData)).toEqual(
      healthDataGroupedByYear
    );
  });
});

describe('groupHealthDataByInequalities', () => {
  it('should group health data by sex', () => {
    const healthDataGroupedBySex = {
      Persons: [
        MOCK_INEQUALITIES_DATA.healthData[0],
        MOCK_INEQUALITIES_DATA.healthData[2],
      ],
      Male: [MOCK_INEQUALITIES_DATA.healthData[1]],
      Female: [MOCK_INEQUALITIES_DATA.healthData[3]],
    };

    expect(
      groupHealthDataByInequalities(MOCK_INEQUALITIES_DATA.healthData)
    ).toEqual(healthDataGroupedBySex);
  });
});

describe('getYearDataGroupedByInequalities', () => {
  it('should group year data by sex', () => {
    expect(
      getYearDataGroupedByInequalities(
        groupHealthDataByYear(MOCK_INEQUALITIES_DATA.healthData)
      )
    ).toEqual(yearlyHealthDataGroupedBySex);
  });
});

describe('getDynamicKeys', () => {
  it('should get unique keys for sex inequality sorted', () => {
    const expectedKeys = ['Persons', 'Male', 'Female'];

    expect(
      getDynamicKeys(yearlyHealthDataGroupedBySex, InequalitiesTypes.Sex)
    ).toEqual(expectedKeys);
  });

  it('should get unique keys for inequality unsorted', () => {
    const expectedKeys = ['Persons', 'Female', 'Male'];

    expect(
      getDynamicKeys(
        yearlyHealthDataGroupedBySex,
        InequalitiesTypes.Deprivation
      )
    ).toEqual(expectedKeys);
  });
});

describe('mapToInequalitiesTableData', () => {
  it('should map to inequalitiesSexTable row data', () => {
    const expectedInequalitiesSexTableRow: InequalitiesTableRowData[] = [
      ...mockInequalitiesRowData,
    ];

    expect(mapToInequalitiesTableData(GROUPED_YEAR_DATA)).toEqual(
      expectedInequalitiesSexTableRow
    );
  });
});

describe('getBenchmarkData', () => {
  const barChartData: InequalitiesBarChartData = {
    areaName: 'Area 1',
    data: {
      period: 2008,
      inequalities: {
        Persons: { value: 135.149304 },
        Male: { value: 890.328253 },
        Female: { value: 890.328253 },
      },
    },
  };

  it('should get benchmark data', () => {
    expect(getBenchmarkData(InequalitiesTypes.Sex, barChartData)).toBe(
      135.149304
    );
  });
});

describe('generateLineChartSeriesData', () => {
  const keys = ['Persons', 'Male', 'Female'];
  const personsLine = {
    type: 'line',
    name: 'Persons',
    data: [
      [2004, undefined],
      [2008, 135.149304],
    ],
    marker: {
      symbol: 'square',
    },
    color: GovukColours.Orange,
  };

  const seriesData = [
    personsLine,
    {
      type: 'line',
      name: 'Male',
      data: [
        [2004, 703.420759],
        [2008, 890.328253],
      ],
      marker: {
        symbol: 'triangle',
      },
      color: UniqueChartColours.OtherLightBlue,
    },
    {
      type: 'line',
      name: 'Female',
      data: [
        [2004, 703.420759],
        [2008, 890.328253],
      ],
      marker: {
        symbol: 'triangle-down',
      },
      color: GovukColours.Purple,
    },
  ];

  it('should generate expected series data for inequalities line chart', () => {
    const areasSelected = ['A1'];

    expect(
      generateInequalitiesLineChartSeriesData(
        keys,
        InequalitiesTypes.Sex,
        mockInequalitiesRowData,
        areasSelected
      )
    ).toEqual(seriesData);
  });

  it('should generate series data without England line color when empty area selected list is passed', () => {
    const areas: string[] = [];
    expect(
      generateInequalitiesLineChartSeriesData(
        keys,
        InequalitiesTypes.Sex,
        mockInequalitiesRowData,
        areas
      )
    ).toEqual(seriesData);
  });

  it('should generate expected series data with appropriate line colour when England is selected area', () => {
    const areasSelected = [areaCodeForEngland];
    const expectedPersonsLine = {
      ...personsLine,
      color: GovukColours.Black,
    };

    const expectedEnglandSeriesData = [
      expectedPersonsLine,
      ...seriesData.slice(1),
    ];

    expect(
      generateInequalitiesLineChartSeriesData(
        keys,
        InequalitiesTypes.Sex,
        mockInequalitiesRowData,
        areasSelected
      )
    ).toEqual(expectedEnglandSeriesData);
  });

  it('should return empty list if no keys are passed', () => {
    const areasSelected = ['A1'];
    expect(
      generateInequalitiesLineChartSeriesData(
        [],
        InequalitiesTypes.Sex,
        mockInequalitiesRowData,
        areasSelected
      )
    ).toEqual([]);
  });
});

describe('getAggregatePointInfo', () => {
  const testData: Record<string, RowDataFields | undefined> = {
    ...mockInequalitiesRowData[1].inequalities,
  };
  testData.Persons = { ...testData.Persons, isAggregate: true };
  testData.Male = { ...testData.Male, isAggregate: false };
  testData.Female = { ...testData.Female, isAggregate: false };
  it('should return the benchmark point and value', () => {
    const result = getAggregatePointInfo(testData);
    expect(result).toHaveProperty('benchmarkPoint', testData.Persons);
    expect(result).toHaveProperty('benchmarkValue', testData.Persons?.value);
  });

  it('should return the aggregate key', () => {
    const result = getAggregatePointInfo(testData);
    expect(result).toHaveProperty('aggregateKey', 'Persons');
  });

  it('should return the inequalityDimensions', () => {
    const result = getAggregatePointInfo(testData);
    expect(result).toHaveProperty('inequalityDimensions', ['Female', 'Male']);
  });

  it('should return all the keys sorted', () => {
    const result = getAggregatePointInfo(testData);
    expect(result).toHaveProperty('sortedKeys', ['Female', 'Male', 'Persons']);
  });
});
