import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
} from '@/generated-sources/ft-api-client';
import {
  generateInequalitiesLineChartSeriesData,
  getAggregatePointInfo,
  getDynamicKeys,
  reorderItemsArraysToEnd,
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
  getAreasWithInequalitiesData,
  isSexTypePresent,
  getInequalityCategories,
  sexCategory,
  getInequalitiesType,
  InequalitiesChartData,
  ChartType,
} from './inequalitiesHelpers';
import { GROUPED_YEAR_DATA, MOCK_HEALTH_DATA } from '@/lib/tableHelpers/mocks';
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
import {
  mockIndicatorData,
  mockEnglandData,
  mockParentData,
} from '../../../organisms/LineChart/mocks';
import {
  generateHealthDataPoint,
  generateMockHealthDataForArea,
} from '@/lib/chartHelpers/testHelpers';
import { lineChartDefaultOptions } from '../../../organisms/LineChart/helpers/generateStandardLineChartOptions';

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

const mockChartData: InequalitiesChartData = {
  areaCode: 'A1425',
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
    dashStyle: 'Solid',
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
      dashStyle: 'Solid',
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
      dashStyle: 'Solid',
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
      marker: {
        symbol: 'circle',
      },
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

  it('should generate expected series data with appropriate line colour when England is selected as Inequality dropdown area', () => {
    const areasSelected = ['A1'];
    const expectedPersonsLine = {
      ...personsLine,
      color: GovukColours.Black,
      marker: {
        symbol: 'circle',
      },
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
        false,
        areaCodeForEngland
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

  it('should use the expected styling for deprivation data', () => {
    const mockChartData = {
      areaCode: 'A1425',
      areaName: 'North FooBar',
      rowData: [
        {
          period: 2004,
          inequalities: {
            ['England']: {
              value: 703.420759,
              sequence: 11,
              isAggregate: true,
            },
            ['Most deprived decile']: {
              value: 703.420759,
              sequence: 10,
              isAggregate: false,
            },
            ['Second most deprived decile']: {
              value: 693.420759,
              sequence: 9,
              isAggregate: false,
            },
            ['Third more deprived decile']: {
              value: 683.420759,
              sequence: 8,
              isAggregate: false,
            },
            ['Fourth more deprived decile']: {
              value: 673.420759,
              sequence: 7,
              isAggregate: false,
            },
            ['Fifth more deprived decile']: {
              value: 663.420759,
              sequence: 6,
              isAggregate: false,
            },
            ['Fifth less deprived decile']: {
              value: 653.420759,
              sequence: 5,
              isAggregate: false,
            },
            ['Fourth less deprived decile']: {
              value: 643.420759,
              sequence: 4,
              isAggregate: false,
            },
            ['Third less deprived decile']: {
              value: 633.420759,
              sequence: 3,
              isAggregate: false,
            },
            ['Second least deprived decile']: {
              value: 623.420759,
              sequence: 2,
              isAggregate: false,
            },
            ['Least deprived decile']: {
              value: 613.420759,
              sequence: 1,
              isAggregate: false,
            },
          },
        },
      ],
    };

    expect(
      generateInequalitiesLineChartSeriesData(
        [
          'England',
          'Most deprived decile',
          'Second most deprived decile',
          'Third more deprived decile',
          'Fourth more deprived decile',
          'Fifth more deprived decile',
          'Fifth less deprived decile',
          'Fourth less deprived decile',
          'Third less deprived decile',
          'Second least deprived decile',
          'Least deprived decile',
        ],
        InequalitiesTypes.Deprivation,
        mockChartData,
        ['E92000001'],
        false
      )
    ).toEqual(
      expect.arrayContaining([
        {
          name: 'England',
          color: GovukColours.Black,
          dashStyle: 'Solid',
          data: expect.anything(),
          marker: {
            symbol: 'circle',
          },
          type: 'line',
        },
        {
          name: 'Most deprived decile',
          color: GovukColours.LightPurple,
          dashStyle: 'Solid',
          data: expect.anything(),
          marker: {
            symbol: 'triangle',
          },
          type: 'line',
        },
        {
          name: 'Second most deprived decile',
          color: GovukColours.DarkPink,
          dashStyle: 'Solid',
          data: expect.anything(),
          marker: {
            symbol: 'triangle-down',
          },
          type: 'line',
        },
        {
          name: 'Third more deprived decile',
          color: GovukColours.Green,
          dashStyle: 'ShortDash',
          data: expect.anything(),
          marker: {
            symbol: 'circle',
          },
          type: 'line',
        },
        {
          name: 'Fourth more deprived decile',
          color: GovukColours.Pink,
          dashStyle: 'ShortDash',
          data: expect.anything(),
          marker: {
            symbol: 'diamond',
          },
          type: 'line',
        },
        {
          name: 'Fifth more deprived decile',
          color: GovukColours.Purple,
          dashStyle: 'ShortDash',
          data: expect.anything(),
          marker: {
            symbol: 'square',
          },
          type: 'line',
        },
        {
          name: 'Fifth less deprived decile',
          color: GovukColours.Yellow,
          dashStyle: 'ShortDash',
          data: expect.anything(),
          marker: {
            symbol: 'triangle',
          },
          type: 'line',
        },
        {
          name: 'Fourth less deprived decile',
          color: GovukColours.Red,
          dashStyle: 'ShortDash',
          data: expect.anything(),
          marker: {
            symbol: 'triangle-down',
          },
          type: 'line',
        },
        {
          name: 'Third less deprived decile',
          color: GovukColours.Blue,
          dashStyle: 'Dash',
          data: expect.anything(),
          marker: {
            symbol: 'circle',
          },
          type: 'line',
        },
        {
          name: 'Second least deprived decile',
          color: GovukColours.LightPink,
          dashStyle: 'Dash',
          data: expect.anything(),
          marker: {
            symbol: 'diamond',
          },
          type: 'line',
        },
        {
          name: 'Least deprived decile',
          color: GovukColours.Brown,
          dashStyle: 'Dash',
          data: expect.anything(),
          marker: {
            symbol: 'square',
          },
          type: 'line',
        },
      ])
    );
  });

  it('should only include years for which the selected areas have data', () => {
    const areasSelected = ['A1'];
    const mockChartDataWithExtraYears: InequalitiesChartData = {
      areaCode: 'A1425',
      areaName: 'A1',
      rowData: [
        ...mockInequalitiesRowData,
        {
          period: 2003,
          inequalities: {
            Persons: {
              value: 333,
              upper: 334,
              lower: 332,
              isAggregate: true,
            },
          },
        },
        {
          period: 2009,
          inequalities: {
            Persons: {
              value: 333,
              upper: 334,
              lower: 332,
              isAggregate: true,
            },
          },
        },
      ],
    };

    const actual = generateInequalitiesLineChartSeriesData(
      sexKeys,
      InequalitiesTypes.Sex,
      mockChartDataWithExtraYears,
      areasSelected,
      false
    );
    expect(actual).toEqual(seriesData);
  });

  it('should include CIs for aggregate series only for years for which the selected areas have data', () => {
    const areasSelected = ['A1'];
    const mockChartDataWithExtraYears: InequalitiesChartData = {
      areaCode: 'A1425',
      areaName: 'A1',
      rowData: [
        ...mockInequalitiesRowData,
        {
          period: 2003,
          inequalities: {
            Persons: {
              value: 333,
              upper: 334,
              lower: 332,
              isAggregate: true,
            },
          },
        },
        {
          period: 2009,
          inequalities: {
            Persons: {
              value: 333,
              upper: 334,
              lower: 332,
              isAggregate: true,
            },
          },
        },
      ],
    };
    const expected = [
      [2004, undefined, undefined],
      [2008, 441.69151, 578.32766],
    ];

    const actual = generateInequalitiesLineChartSeriesData(
      sexKeys,
      InequalitiesTypes.Sex,
      mockChartDataWithExtraYears,
      areasSelected,
      true
    );

    const actualPersonsErrorbars = actual.filter(
      (series) => series.type === 'errorbar' && series.name === 'Persons'
    )[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((actualPersonsErrorbars as any).data).toEqual(expected);
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
        headerFormat: '',
        useHTML: true,
      },
      series: generateInequalitiesLineChartSeriesData(
        sexKeys,
        InequalitiesTypes.Sex,
        mockChartData,
        ['A1'],
        false
      ),
      title: {
        text: 'inequalities from 2004 to 2008',
        style: {
          display: 'none',
        },
      },
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

  it('should generate inequalities line chart options with indicator name and area', () => {
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
        indicatorName: 'Random indicator',
        areaName: 'Random area',
      }
    );

    expect(actual.title?.text).toBe(
      'Random indicator inequalities for Random area from 2004 to 2008'
    );
  });

  it('should display empty string for area name if not provided', () => {
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
        indicatorName: 'Random indicator',
      }
    );

    expect(actual.title?.text).toBe(
      `Random indicator inequalities from 2004 to 2008`
    );
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
    ...mockEnglandData,
    healthData: [
      ...mockEnglandData.healthData,
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
    const expectedBenchmarkDataWithoutInequalities = { ...mockEnglandData };
    const expectedGroupDataWithoutInequalities = { ...mockParentData };

    const expected = {
      areaDataWithoutInequalities: expectedHealthDataWithoutInequalities,
      englandDataWithoutInequalities: expectedBenchmarkDataWithoutInequalities,
      groupDataWithoutInequalities: expectedGroupDataWithoutInequalities,
    };

    expect(
      getAllDataWithoutInequalities(
        mockHealthIndicatorData,
        { englandIndicatorData: benchmarkData, groupData },
        ['A1425']
      )
    ).toEqual(expected);
  });

  it('should return undefined benchmark data and group data when both are not provided', () => {
    const expected = {
      areaDataWithoutInequalities: [{ ...mockIndicatorData[0] }],
      englandDataWithoutInequalities: undefined,
      groupDataWithoutInequalities: undefined,
    };

    expect(
      getAllDataWithoutInequalities(
        mockHealthIndicatorData,
        { englandIndicatorData: undefined, groupData: undefined },
        []
      )
    ).toEqual(expected);
  });

  it('should return empty areaDataWithoutInequalities if England is the selected area', () => {
    const expected = {
      areaDataWithoutInequalities: [],
      englandDataWithoutInequalities: mockEnglandData,
      groupDataWithoutInequalities: undefined,
    };

    expect(
      getAllDataWithoutInequalities(
        mockHealthIndicatorData,
        { englandIndicatorData: benchmarkData },
        [areaCodeForEngland]
      )
    ).toEqual(expected);
  });
});

describe('getAreasWithInequalitiesData', () => {
  const mockHealthIndicatorData = [
    generateMockHealthDataForArea('A001', [
      generateHealthDataPoint(2024, false, false),
      generateHealthDataPoint(2023, true, false),
      generateHealthDataPoint(2022, false, false),
      generateHealthDataPoint(2021, true, false),
    ]),
    generateMockHealthDataForArea(areaCodeForEngland, [
      generateHealthDataPoint(2024, true, false),
      generateHealthDataPoint(2023, true, false),
      generateHealthDataPoint(2022, false, false),
      generateHealthDataPoint(2021, true, false),
    ]),
    generateMockHealthDataForArea('A002', [
      generateHealthDataPoint(2024, false, false),
      generateHealthDataPoint(2023, false, false),
      generateHealthDataPoint(2022, true, false),
      generateHealthDataPoint(2021, true, false),
    ]),
    generateMockHealthDataForArea('A003', [
      generateHealthDataPoint(2024, true, false),
      generateHealthDataPoint(2023, true, false),
      generateHealthDataPoint(2022, true, false),
      generateHealthDataPoint(2021, true, false),
    ]),
    generateMockHealthDataForArea('A004', [
      generateHealthDataPoint(2024, false, true),
      generateHealthDataPoint(2023, false, true),
      generateHealthDataPoint(2022, false, true),
      generateHealthDataPoint(2021, true, true),
    ]),
  ];

  describe('for a particular year', () => {
    it('should return all the areas that have sex inequality data for the year provided', () => {
      const expectedAreaCodes = [areaCodeForEngland, 'A001', 'A004'];

      const areasWithSexInequalityDataForYear = getAreasWithInequalitiesData(
        mockHealthIndicatorData,
        InequalitiesTypes.Sex,
        '2022'
      );

      expect(areasWithSexInequalityDataForYear).toHaveLength(3);

      areasWithSexInequalityDataForYear.forEach((area, i) => {
        expect(area.code).toEqual(expectedAreaCodes[i]);
      });
    });

    it('should return all the areas that have deprivation inequality data for the year provided', () => {
      const expectedAreaCodes = [areaCodeForEngland, 'A001', 'A002', 'A003'];

      const areasWithSexInequalityDataForYear = getAreasWithInequalitiesData(
        mockHealthIndicatorData,
        InequalitiesTypes.Deprivation,
        '2023'
      );

      expect(areasWithSexInequalityDataForYear).toHaveLength(4);

      areasWithSexInequalityDataForYear.forEach((area, i) => {
        expect(area.code).toEqual(expectedAreaCodes[i]);
      });
    });

    it('should return an empty array if there are no areas that have sex inequality data for the year provided', () => {
      const areasWithSexInequalityDataForYear = getAreasWithInequalitiesData(
        mockHealthIndicatorData,
        InequalitiesTypes.Sex,
        '2021'
      );

      expect(areasWithSexInequalityDataForYear).toEqual([]);
    });
  });

  describe('for all years', () => {
    it('should return all the areas sorted alphabetically with england first - that have sex inequality data for at least one year', () => {
      const expectedAreaCodes = [areaCodeForEngland, 'A001', 'A002', 'A004'];

      const areasWithSexInequalityDataForYear = getAreasWithInequalitiesData(
        mockHealthIndicatorData,
        InequalitiesTypes.Sex
      );

      expect(areasWithSexInequalityDataForYear).toHaveLength(4);

      areasWithSexInequalityDataForYear.forEach((area, i) => {
        expect(area.code).toEqual(expectedAreaCodes[i]);
      });
    });

    it('should return all the areas that have deprivation inequality data for at least one year', () => {
      const expectedAreaCodes = [areaCodeForEngland, 'A001', 'A002', 'A003'];

      const areasWithSexInequalityDataForYear = getAreasWithInequalitiesData(
        mockHealthIndicatorData,
        InequalitiesTypes.Deprivation
      );

      expect(areasWithSexInequalityDataForYear).toHaveLength(4);

      areasWithSexInequalityDataForYear.forEach((area, i) => {
        expect(area.code).toEqual(expectedAreaCodes[i]);
      });
    });
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

describe('isSexTypePresent', () => {
  it('should return false if sex type is not present', () => {
    expect(isSexTypePresent(mockIndicatorData[0].healthData)).toBe(false);
  });

  it('should return true if sex type is present', () => {
    expect(isSexTypePresent(MOCK_INEQUALITIES_DATA.healthData)).toBe(true);
  });

  it('should return false if sex type is not present for year provided', () => {
    const healthIndicatorData = {
      ...MOCK_INEQUALITIES_DATA,
      healthData: [
        ...MOCK_INEQUALITIES_DATA.healthData,
        {
          ...MOCK_INEQUALITIES_DATA.healthData[0],
          year: 2020,
        },
      ],
    };
    expect(isSexTypePresent(healthIndicatorData.healthData, 2020)).toBe(false);
  });

  it('should return true if sex type is present for year provided', () => {
    expect(isSexTypePresent(MOCK_INEQUALITIES_DATA.healthData, 2006)).toBe(
      true
    );
  });
});

describe('getInequalityCategories', () => {
  const mockDeprivationData = {
    year: 2008,
    count: 267,
    value: 703.420759,
    lowerCi: 441.69151,
    upperCi: 578.32766,
    ageBand: allAgesAge,
    sex: personsSex,
    trend: HealthDataPointTrendEnum.NotYetCalculated,
    deprivation: {
      ...noDeprivation,
      isAggregate: false,
      type: 'Unitary deciles',
    },
    isAggregate: false,
  };

  it('should return only Sex category when sex is present and deprivation is not', () => {
    expect(getInequalityCategories(MOCK_INEQUALITIES_DATA)).toEqual([
      sexCategory,
    ]);
  });

  it('should return only deprivation categories when deprivation data is present and sex is not', () => {
    const mockHealthData: HealthDataForArea = {
      ...MOCK_HEALTH_DATA[0],
      healthData: [
        ...MOCK_HEALTH_DATA[0].healthData.slice(0, 2),
        mockDeprivationData,
      ],
    };

    expect(getInequalityCategories(mockHealthData)).toEqual([
      'Unitary deciles',
    ]);
  });

  it('should return both sex and deprivation categories sorted in alphabetical order when both are present', () => {
    const mockHealthData: HealthDataForArea = {
      ...MOCK_INEQUALITIES_DATA,
      healthData: [...MOCK_INEQUALITIES_DATA.healthData, mockDeprivationData],
    };

    expect(getInequalityCategories(mockHealthData)).toEqual([
      'Sex',
      'Unitary deciles',
    ]);
  });

  it('should return empty list when neither inequality type is present', () => {
    const mockHealthData: HealthDataForArea = {
      ...MOCK_HEALTH_DATA[0],
      healthData: MOCK_HEALTH_DATA[0].healthData.slice(0, 2),
    };

    expect(getInequalityCategories(mockHealthData)).toEqual([]);
  });

  it('should not return deprivation categories when deprivation data is not available for year provided', () => {
    const mockHealthData: HealthDataForArea = {
      ...MOCK_INEQUALITIES_DATA,
      healthData: [...MOCK_INEQUALITIES_DATA.healthData, mockDeprivationData],
    };

    expect(getInequalityCategories(mockHealthData, 2006)).toEqual(['Sex']);
  });

  it('should exclude categories with health data for only one year when chartType is trend', () => {
    const mockHealthData: HealthDataForArea = {
      areaCode: 'area1',
      areaName: 'Area 1',
      healthData: [
        {
          ...mockDeprivationData,
          year: 2020,
          deprivation: {
            ...mockDeprivationData.deprivation,
            type: 'Category 1',
          },
        },
        {
          ...mockDeprivationData,
          year: 2020,
          deprivation: {
            ...mockDeprivationData.deprivation,
            type: 'Category 2',
          },
        },
        {
          ...mockDeprivationData,
          year: 2021,
          deprivation: {
            ...mockDeprivationData.deprivation,
            type: 'Category 2',
          },
        },
      ],
    };

    const result = getInequalityCategories(
      mockHealthData,
      undefined,
      ChartType.Trend
    );

    expect(result).toEqual(['Category 2']);
  });
});

describe('getInequalitiesType', () => {
  const categories = ['County deciles', 'Sex', 'Unitary deciles'];
  it('should return sex type when Sex is the selected type', () => {
    expect(getInequalitiesType(categories, sexCategory)).toBe(
      InequalitiesTypes.Sex
    );
  });

  it('should default to the first category when no inequality type is selected', () => {
    expect(getInequalitiesType(categories, undefined)).toBe(
      InequalitiesTypes.Deprivation
    );
  });

  it('should return deprivation type when a deprivation category is selected', () => {
    expect(getInequalitiesType(categories, 'Unitary deciles')).toBe(
      InequalitiesTypes.Deprivation
    );
  });
});

describe('reorderItemsArraysToEnd', () => {
  it('Check that when specific headers are provided for reordering, the array is reordered accordingly.', () => {
    const headers = reorderItemsArraysToEnd(
      ['Deprivation', 'Ethnicity', 'Age', 'Name', 'Sex', 'Other'],
      ['Name', 'Age', 'Sex', 'Other']
    );
    expect(headers).toEqual([
      'Deprivation',
      'Ethnicity',
      'Name',
      'Age',
      'Sex',
      'Other',
    ]);
  });

  it('If the original header is empty, I expect to receive an empty array', () => {
    const headers = reorderItemsArraysToEnd([], ['Name', 'Age', 'Sex']);
    expect(headers).toEqual([]);
  });

  it('When the list of specific reorder headers is empty, return the original headers', () => {
    const headers = reorderItemsArraysToEnd(['Name', 'Age', 'Sex']);
    expect(headers).toEqual(['Name', 'Age', 'Sex']);
  });
});
