import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import {
  generateInequalitiesLineChartSeriesData,
  getAggregatePointInfo,
  getDynamicKeys,
  getYearDataGroupedByInequalities,
  groupHealthDataByYear,
  InequalitiesTableRowData,
  InequalitiesTypes,
  mapToInequalitiesTableData,
  RowDataFields,
  shouldDisplayInequalities,
  generateInequalitiesLineChartOptions,
  getAllDataWithoutInequalities,
  groupHealthDataByInequality,
  filterHealthData,
  YearlyHealthDataGroupedByInequalities,
  valueSelectorForInequality,
  sequenceSelectorForInequality,
  healthDataFilterFunctionGeneratorForInequality,
  getYearsWithInequalityData,
} from './inequalitiesHelpers';
import { GROUPED_YEAR_DATA } from '@/lib/tableHelpers/mocks';
import { UniqueChartColours } from '@/lib/chartHelpers/colours';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  allAgesAge,
  femaleSex,
  healthDataPoint,
  maleSex,
  noDeprivation,
  personsSex,
} from '@/lib/mocks';
import { lineChartDefaultOptions } from '../LineChart/lineChartHelpers';
import {
  mockIndicatorData,
  mockBenchmarkData,
  mockParentData,
} from '../LineChart/mocks';

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
      sex: personsSex,
      ageBand: allAgesAge,
      trend: HealthDataPointTrendEnum.NotYetCalculated,
      deprivation: noDeprivation,
    },
    {
      count: 400,
      lowerCi: 443.453,
      upperCi: 470.45543,
      value: 450.5343,
      year: 2006,
      sex: maleSex,
      ageBand: allAgesAge,
      trend: HealthDataPointTrendEnum.NotYetCalculated,
      deprivation: noDeprivation,
    },
    {
      count: 267,
      lowerCi: 441.69151,
      upperCi: 578.32766,
      value: 703.420759,
      year: 2004,
      sex: personsSex,
      ageBand: allAgesAge,
      trend: HealthDataPointTrendEnum.NotYetCalculated,
      deprivation: noDeprivation,
    },
    {
      count: 300,
      lowerCi: 345.4543,
      upperCi: 400.34234,
      value: 370.34334,
      year: 2004,
      sex: femaleSex,
      ageBand: allAgesAge,
      trend: HealthDataPointTrendEnum.NotYetCalculated,
      deprivation: noDeprivation,
    },
  ],
};

const yearlyHealthDataGroupedBySex: YearlyHealthDataGroupedByInequalities = {
  2004: {
    Persons: [MOCK_INEQUALITIES_DATA.healthData[2]],
    Female: [MOCK_INEQUALITIES_DATA.healthData[3]],
  },
  2006: {
    Persons: [MOCK_INEQUALITIES_DATA.healthData[0]],
    Male: [MOCK_INEQUALITIES_DATA.healthData[1]],
  },
};

const mockInequalitiesRowData: InequalitiesTableRowData[] = [
  {
    period: 2004,
    inequalities: {
      Male: {
        value: 703.420759,
        count: 267,
        upper: 578.32766,
        lower: 441.69151,
        sequence: 1,
        isAggregate: false,
        benchmarkComparison: undefined,
      },
      Female: {
        value: 703.420759,
        count: 267,
        upper: 578.32766,
        lower: 441.69151,
        sequence: 1,
        isAggregate: false,
        benchmarkComparison: undefined,
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
        sequence: 1,
        isAggregate: true,
        benchmarkComparison: undefined,
      },
      Male: {
        value: 890.328253,
        count: 131,
        upper: 578.32766,
        lower: 441.69151,
        sequence: 1,
        isAggregate: false,
        benchmarkComparison: undefined,
      },
      Female: {
        value: 890.328253,
        count: 131,
        upper: 578.32766,
        lower: 441.69151,
        sequence: 1,
        isAggregate: false,
        benchmarkComparison: undefined,
      },
    },
  },
];

const mockChartData = {
  areaName: 'North FooBar',
  rowData: [...mockInequalitiesRowData],
};

const sexKeys = ['Persons', 'Male', 'Female'];

describe('valueSelectorForInequality', () => {
  it('should select the sex value for the Sex inequality type', () => {
    const valueSelector = valueSelectorForInequality[InequalitiesTypes.Sex];

    expect(valueSelector(healthDataPoint)).toBe(healthDataPoint.sex.value);
  });

  it('should select the deprivation value for the Deprivation inequality type', () => {
    const valueSelector =
      valueSelectorForInequality[InequalitiesTypes.Deprivation];

    expect(valueSelector(healthDataPoint)).toBe(
      healthDataPoint.deprivation.value
    );
  });
});

describe('sequenceSelectorForInequality', () => {
  it('should return 0 for the Sex inequality type', () => {
    const sequenceSelector =
      sequenceSelectorForInequality[InequalitiesTypes.Sex];

    expect(sequenceSelector(healthDataPoint)).toBe(0);
  });

  it('should select the deprivation sequence value for the Deprivation inequality type', () => {
    const sequenceSelector =
      sequenceSelectorForInequality[InequalitiesTypes.Deprivation];

    expect(sequenceSelector(healthDataPoint)).toBe(
      healthDataPoint.deprivation.sequence
    );
  });
});

describe('healthDataFilterFunctionGeneratorForInequality', () => {
  it('should return a filter function that results in the correct data for the Sex inequality type', () => {
    const healthDataFilterFunctionGenerator =
      healthDataFilterFunctionGeneratorForInequality[InequalitiesTypes.Sex];
    const healthDataFilterFunction = healthDataFilterFunctionGenerator('');

    const healthData: HealthDataPoint[] = [
      {
        ...healthDataPoint,
        isAggregate: true,
      },
      {
        ...healthDataPoint,
        sex: { ...healthDataPoint.sex, isAggregate: false },
      },
      {
        ...healthDataPoint,
        ageBand: { ...healthDataPoint.ageBand, isAggregate: false },
      },
      {
        ...healthDataPoint,
        deprivation: { ...healthDataPoint.deprivation, isAggregate: false },
      },
    ];

    const filteredHealthData = healthData.filter(healthDataFilterFunction);

    expect(filteredHealthData).toEqual([
      {
        ...healthDataPoint,
        isAggregate: true,
      },
      {
        ...healthDataPoint,
        sex: { ...healthDataPoint.sex, isAggregate: false },
      },
    ]);
  });

  it('should return a filter function that results in the correct data for the Deprivation inequality type', () => {
    const deprivationType =
      'Districts and Unitary Authorities deprivation deciles';

    const healthDataFilterFunctionGenerator =
      healthDataFilterFunctionGeneratorForInequality[
        InequalitiesTypes.Deprivation
      ];
    const healthDataFilterFunction =
      healthDataFilterFunctionGenerator(deprivationType);

    const healthData: HealthDataPoint[] = [
      {
        ...healthDataPoint,
        isAggregate: true,
      },
      {
        ...healthDataPoint,
        sex: { ...healthDataPoint.sex, isAggregate: false },
      },
      {
        ...healthDataPoint,
        ageBand: { ...healthDataPoint.ageBand, isAggregate: false },
      },
      {
        ...healthDataPoint,
        deprivation: {
          ...healthDataPoint.deprivation,
          isAggregate: false,
          type: deprivationType,
        },
      },
      {
        ...healthDataPoint,
        deprivation: {
          ...healthDataPoint.deprivation,
          isAggregate: false,
          type: 'Some other deprivation type',
        },
      },
    ];

    const filteredHealthData = healthData.filter(healthDataFilterFunction);

    expect(filteredHealthData).toEqual([
      {
        ...healthDataPoint,
        isAggregate: true,
      },
      {
        ...healthDataPoint,
        deprivation: {
          ...healthDataPoint.deprivation,
          isAggregate: false,
          type: deprivationType,
        },
      },
    ]);
  });
});

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

describe('groupHealthDataByInequality', () => {
  it('should group health data using the specified value', () => {
    const healthDataGroupedBySex = {
      Persons: [
        MOCK_INEQUALITIES_DATA.healthData[0],
        MOCK_INEQUALITIES_DATA.healthData[2],
      ],
      Male: [MOCK_INEQUALITIES_DATA.healthData[1]],
      Female: [MOCK_INEQUALITIES_DATA.healthData[3]],
    };

    expect(
      groupHealthDataByInequality(
        MOCK_INEQUALITIES_DATA.healthData,
        (data) => data.sex.value
      )
    ).toEqual(healthDataGroupedBySex);
  });
});

describe('getYearDataGroupedByInequalities', () => {
  it('should group year data by the specified value', () => {
    expect(
      getYearDataGroupedByInequalities(
        groupHealthDataByYear(MOCK_INEQUALITIES_DATA.healthData),
        (data) => data.sex.value
      )
    ).toEqual(yearlyHealthDataGroupedBySex);
  });
});

describe('getDynamicKeys', () => {
  const yearlyHealthDataGroupedBySexWithSequences: YearlyHealthDataGroupedByInequalities =
    {
      2004: {
        Persons: [
          {
            ...MOCK_INEQUALITIES_DATA.healthData[2],
            deprivation: {
              ...MOCK_INEQUALITIES_DATA.healthData[2].deprivation,
              sequence: 1,
            },
          },
        ],
        Female: [
          {
            ...MOCK_INEQUALITIES_DATA.healthData[3],
            deprivation: {
              ...MOCK_INEQUALITIES_DATA.healthData[3].deprivation,
              sequence: 3,
            },
          },
        ],
        Male: [
          {
            ...MOCK_INEQUALITIES_DATA.healthData[1],
            deprivation: {
              ...MOCK_INEQUALITIES_DATA.healthData[1].deprivation,
              sequence: 2,
            },
          },
        ],
      },
      2006: {
        Persons: [
          {
            ...MOCK_INEQUALITIES_DATA.healthData[0],
            deprivation: {
              ...MOCK_INEQUALITIES_DATA.healthData[0].deprivation,
              sequence: 1,
            },
          },
        ],
        Male: [
          {
            ...MOCK_INEQUALITIES_DATA.healthData[1],
            deprivation: {
              ...MOCK_INEQUALITIES_DATA.healthData[1].deprivation,
              sequence: 2,
            },
          },
        ],
        Female: [
          {
            ...MOCK_INEQUALITIES_DATA.healthData[3],
            deprivation: {
              ...MOCK_INEQUALITIES_DATA.healthData[3].deprivation,
              sequence: 3,
            },
          },
        ],
      },
    };

  it('should get unique keys for inequality sorted in descending alphabetical order when a constant sequence value is used', () => {
    const sequenceSelector = () => 0;

    expect(
      getDynamicKeys(
        yearlyHealthDataGroupedBySexWithSequences,
        sequenceSelector
      )
    ).toEqual(['Persons', 'Male', 'Female']);
  });

  it('should get unique keys for inequality sorted in descending sequence order when a sequence selector is used', () => {
    const sequenceSelector = (data?: HealthDataPoint) =>
      data?.deprivation.sequence ?? 0;

    expect(
      getDynamicKeys(
        yearlyHealthDataGroupedBySexWithSequences,
        sequenceSelector
      )
    ).toEqual(['Female', 'Male', 'Persons']);
  });
});

describe('mapToInequalitiesTableData', () => {
  it('should map to inequalitiesSexTable row data', () => {
    const expectedInequalitiesTableRow: InequalitiesTableRowData[] = [
      ...mockInequalitiesRowData,
    ];
    expect(
      mapToInequalitiesTableData(
        GROUPED_YEAR_DATA,
        (data) => data?.deprivation.sequence ?? 0
      )
    ).toEqual(expectedInequalitiesTableRow);
  });
});

describe('generateLineChartSeriesData', () => {
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

  const confidenceIntervalSeries = {
    type: 'errorbar',
    color: GovukColours.MidGrey,
    whiskerLength: '20%',
    lineWidth: 2,
    visible: false,
  };

  const seriesData = [
    personsLine,
    {
      ...confidenceIntervalSeries,
      data: [
        [2004, undefined, undefined],
        [2008, 441.69151, 578.32766],
      ],
      name: mockChartData.areaName,
    },
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
      ...confidenceIntervalSeries,
      data: [
        [2004, 441.69151, 578.32766],
        [2008, 441.69151, 578.32766],
      ],
      name: mockChartData.areaName,
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
    {
      ...confidenceIntervalSeries,
      data: [
        [2004, 441.69151, 578.32766],
        [2008, 441.69151, 578.32766],
      ],
      name: mockChartData.areaName,
    },
  ];

  it('should generate expected series data for inequalities line chart', () => {
    const areasSelected = ['A1'];

    expect(
      generateInequalitiesLineChartSeriesData(
        sexKeys,
        InequalitiesTypes.Sex,
        mockChartData,
        areasSelected,
        false
      )
    ).toEqual(seriesData);
  });

  it('should generate series data without England line color when empty area selected list is passed', () => {
    const areas: string[] = [];
    expect(
      generateInequalitiesLineChartSeriesData(
        sexKeys,
        InequalitiesTypes.Sex,
        mockChartData,
        areas,
        false
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
        sexKeys,
        InequalitiesTypes.Sex,
        mockChartData,
        areasSelected,
        false
      )
    ).toEqual(expectedEnglandSeriesData);
  });

  it('should return empty list if no keys are passed', () => {
    const areasSelected = ['A1'];
    expect(
      generateInequalitiesLineChartSeriesData(
        [],
        InequalitiesTypes.Sex,
        mockChartData,
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

  const sequenceTestData: Record<string, RowDataFields | undefined> = {
    ...testData,
  };
  sequenceTestData.Persons = { ...sequenceTestData.Persons, sequence: 3 };
  sequenceTestData.Male = { ...sequenceTestData.Male, sequence: 2 };
  sequenceTestData.Female = { ...sequenceTestData.Female, sequence: 1 };

  it('should return the benchmark point and value', () => {
    const result = getAggregatePointInfo(testData);
    expect(result).toHaveProperty('benchmarkPoint', testData.Persons);
    expect(result).toHaveProperty('benchmarkValue', testData.Persons?.value);
  });

  it('should return the aggregate key', () => {
    const result = getAggregatePointInfo(testData);
    expect(result).toHaveProperty('aggregateKey', 'Persons');
  });

  it('should return the inequalityDimensions sorted alphabetically if sequence is not present', () => {
    const result = getAggregatePointInfo(testData);

    expect(result).toHaveProperty('inequalityDimensions', ['Female', 'Male']);
  });

  it('should return the inequalityDimensions sorted by descending order of sequence if present', () => {
    const result = getAggregatePointInfo(sequenceTestData);

    expect(result).toHaveProperty('inequalityDimensions', ['Male', 'Female']);
  });

  it('should return all the keys sorted alphabetically if sequence is not present', () => {
    const result = getAggregatePointInfo(testData);

    expect(result).toHaveProperty('sortedKeys', ['Female', 'Male', 'Persons']);
  });

  it('should return all the keys sorted by descending order of sequence if present', () => {
    const result = getAggregatePointInfo(sequenceTestData);

    expect(result).toHaveProperty('sortedKeys', ['Persons', 'Male', 'Female']);
  });
});

describe('generateInequalitiesLineChartOptions', () => {
  it('should generate inequalities line chart options', () => {
    const expected = {
      ...lineChartDefaultOptions,
      yAxis: {
        ...lineChartDefaultOptions.yAxis,
        title: { text: 'yAxis: %', margin: 20 },
      },
      xAxis: {
        ...lineChartDefaultOptions.xAxis,
        title: { text: 'xAxis', margin: 20 },
      },
      tooltip: {
        headerFormat:
          `<span style="font-weight: bold">${MOCK_INEQUALITIES_DATA.areaName}</span><br/>` +
          '<span>Year {point.x}</span><br/>',
        useHTML: true,
      },
      series: generateInequalitiesLineChartSeriesData(
        sexKeys,
        InequalitiesTypes.Sex,
        mockChartData,
        ['A1'],
        false
      ),
    };

    const actual = generateInequalitiesLineChartOptions(
      mockChartData,
      sexKeys,
      InequalitiesTypes.Sex,
      false,
      () => [],
      {
        yAxisTitleText: 'yAxis',
        xAxisTitleText: 'xAxis',
        measurementUnit: '%',
      }
    );

    expect(actual).toMatchObject(expected);
    expect(actual.tooltip?.pointFormatter).toBeDefined();
    expect(typeof actual.tooltip?.pointFormatter).toBe('function');
  });
});

describe('getAllDataWithoutInequalities', () => {
  const mockHealthIndicatorData: HealthDataForArea[] = [
    {
      ...mockIndicatorData[0],
      healthData: [
        ...mockIndicatorData[0].healthData,
        {
          count: 389,
          lowerCi: 440,
          upperCi: 580,
          value: 530,
          year: 2006,
          sex: maleSex,
          ageBand: allAgesAge,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
          isAggregate: false,
        },
        {
          count: 267,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          value: 703.420759,
          year: 2004,
          sex: femaleSex,
          ageBand: allAgesAge,
          trend: HealthDataPointTrendEnum.NotYetCalculated,
          deprivation: noDeprivation,
          isAggregate: false,
        },
      ],
    },
  ];

  const benchmarkData: HealthDataForArea = {
    ...mockBenchmarkData,
    healthData: [
      ...mockBenchmarkData.healthData,
      {
        count: 389,
        lowerCi: 441.69151,
        upperCi: 578.32766,
        value: 278.29134,
        year: 2006,
        sex: maleSex,
        ageBand: allAgesAge,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
        isAggregate: false,
      },
      {
        count: 267,
        lowerCi: 410,
        upperCi: 450,
        value: 420,
        year: 2004,
        sex: femaleSex,
        ageBand: allAgesAge,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
        isAggregate: false,
      },
    ],
  };

  const groupData: HealthDataForArea = {
    ...mockParentData,
    healthData: [
      ...mockParentData.healthData,
      {
        count: 100,
        lowerCi: 300,
        upperCi: 400,
        value: 350,
        year: 2006,
        sex: maleSex,
        ageBand: allAgesAge,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
        isAggregate: false,
      },
      {
        count: 101,
        lowerCi: 400,
        upperCi: 500,
        value: 450,
        year: 2004,
        sex: femaleSex,
        ageBand: allAgesAge,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
        isAggregate: false,
      },
    ],
  };

  it('should get required data without inequalities', () => {
    const expectedHealthDataWithoutInequalities = [{ ...mockIndicatorData[0] }];
    const expectedBenchmarkDataWithoutInequalities = { ...mockBenchmarkData };
    const expectedGroupDataWithoutInequalities = { ...mockParentData };

    const expected = {
      areaDataWithoutInequalities: expectedHealthDataWithoutInequalities,
      englandBenchmarkWithoutInequalities:
        expectedBenchmarkDataWithoutInequalities,
      groupDataWithoutInequalities: expectedGroupDataWithoutInequalities,
    };

    expect(
      getAllDataWithoutInequalities(
        mockHealthIndicatorData,
        { englandBenchmarkData: benchmarkData, groupData },
        ['A1425']
      )
    ).toEqual(expected);
  });

  it('should return undefined benchmark data and group data when both are not provided', () => {
    const expected = {
      areaDataWithoutInequalities: [{ ...mockIndicatorData[0] }],
      englandBenchmarkWithoutInequalities: undefined,
      groupDataWithoutInequalities: undefined,
    };

    expect(
      getAllDataWithoutInequalities(
        mockHealthIndicatorData,
        { englandBenchmarkData: undefined, groupData: undefined },
        []
      )
    ).toEqual(expected);
  });

  it('should return empty areaDataWithoutInequalities if England is the selected area', () => {
    const expected = {
      areaDataWithoutInequalities: [],
      englandBenchmarkWithoutInequalities: mockBenchmarkData,
      groupDataWithoutInequalities: undefined,
    };

    expect(
      getAllDataWithoutInequalities(
        mockHealthIndicatorData,
        { englandBenchmarkData: benchmarkData },
        [areaCodeForEngland]
      )
    ).toEqual(expected);
  });
});

describe('filterHealthData', () => {
  it('should filter health data using the provided filter function', () => {
    const healthData = MOCK_INEQUALITIES_DATA.healthData;
    const filteredHealthData = filterHealthData(
      healthData,
      (data) => data.year === 2006
    );

    expect(filteredHealthData).toEqual([healthData[0], healthData[1]]);
  });
});

describe('getYearsWithInequalityData', () => {
  it('should return the years that contain inequalities data', () => {
    const expectedYears = [2004, 2008];

    expect(getYearsWithInequalityData(mockInequalitiesRowData)).toEqual(
      expectedYears
    );
  });

  it('should filter out the years without inequalities data', () => {
    const expectedYears = [2004, 2008];

    const mockRowData = [
      ...mockInequalitiesRowData,
      {
        period: 2010,
        inequalities: {
          Persons: {
            value: 703.420759,
            count: 267,
            upper: 578.32766,
            lower: 441.69151,
            sequence: 1,
            isAggregate: true,
          },
        },
      },
    ];

    expect(getYearsWithInequalityData(mockRowData)).toEqual(expectedYears);
  });
});
