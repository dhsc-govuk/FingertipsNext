import {
  convertFieldToCsv,
  convertRowToCsv,
  convertToCsv,
  CsvField,
  populationPyramidTableToCsvArray,
} from '@/lib/downloadHelpers/convertToCsv';
import { PopulationDataForArea } from '../chartHelpers/preparePopulationData';

describe('convertToCsv', () => {
  describe('convertFieldToCsv', () => {
    it.each([
      ['hello world', 'hello world'],
      ['quote "hello"', '"quote ""hello"""'],
      ['hello, comma', '"hello, comma"'],
      [undefined, ''],
      [null, ''],
      ['carriage\rreturn', 'carriagereturn'],
      [123, '123'],
      [',"\n,\r"', '","","""'],
    ])(
      'should wrap in quotes and replace quotes if required',
      (input, expected) => {
        expect(convertFieldToCsv(input)).toEqual(expected);
      }
    );
  });

  describe('convertRowToCsv', () => {
    it('should convert each member of an array', () => {
      const input: CsvField[] = [
        'hello',
        'quote"',
        'com,ma',
        undefined,
        null,
        123.456,
        '\r\n',
      ];
      expect(convertRowToCsv(input)).toEqual(
        'hello,"quote""","com,ma",,,123.456,'
      );
    });
  });

  describe('convertToCsv', () => {
    it('should convert to csv', () => {
      const input: CsvField[][] = [
        [
          'Inequality type',
          'Compared to persons',
          'Count',
          'Value %',
          'Lower',
          'Upper',
        ],
        ['Persons', 2465, 17.4, 16.7, 18.1],
        ['Male', 'Similar', 1075, 17.2, 16.2, 18.2],
        ['Female', 'Similar', 1390, 17.6, 16.7, 18.5],
      ];
      const expected = `Inequality type,Compared to persons,Count,Value %,Lower,Upper\r
Persons,2465,17.4,16.7,18.1\r
Male,Similar,1075,17.2,16.2,18.2\r
Female,Similar,1390,17.6,16.7,18.5`;
      expect(convertToCsv(input)).toEqual(expected);
    });

    it('should convert to csv when given garbage', () => {
      const input: CsvField[][] = [
        [
          'Inequality "type"',
          'Compared, to, persons',
          'Count\r',
          'Value\n%',
          'Lower',
          'Upper',
        ],
        ['Persons', null, '17.4', 16.7, 18.1],
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        [1, 'Similar', [1075], new Set([1, 2, 3]), { a: 'b' }, 18.2],
        ['Female', 'comma,comma', undefined, 17.6, 16.7],
      ];
      const expected = `"Inequality ""type""","Compared, to, persons",Count,Value%,Lower,Upper\r
Persons,,17.4,16.7,18.1\r
1,Similar,1075,[object Set],[object Object],18.2\r
Female,"comma,comma",,17.6,16.7`;
      expect(convertToCsv(input)).toEqual(expected);
    });

    it('should handle empty arrays', () => {
      expect(convertToCsv([])).toEqual('');
      expect(convertToCsv([[]])).toEqual('');
      expect(convertToCsv([[], []])).toEqual('');
    });
  });
});

describe('PopulationPyramidTableToCsv', () => {
  const stubIndicatorId = 'indicatorId';
  const stubIndicatorName = 'indicatorName';
  const stubPeriod = '2023';

  const stubPopulationDataForSelectedArea: PopulationDataForArea = {
    areaCode: 'A001',
    areaName: 'area one',
    total: 0,
    ageCategories: [
      'oldest',
      'upper middle',
      'middle',
      'lower middle',
      'youngest',
    ],
    femaleSeries: [1, 2, 3, 4, 5],
    maleSeries: [5, 4, 3, 2, 1],
  };

  const stubBenchmarkToUse: PopulationDataForArea = {
    areaCode: 'A002',
    areaName: 'benchmark area',
    total: 0,
    ageCategories: stubPopulationDataForSelectedArea.ageCategories,
    femaleSeries: stubPopulationDataForSelectedArea.femaleSeries.map(
      (x) => x * 100
    ),
    maleSeries: stubPopulationDataForSelectedArea.maleSeries.map(
      (x) => x * 100
    ),
  };

  const stubGroupToUse: PopulationDataForArea = {
    areaCode: 'A003',
    areaName: 'group area',
    total: 0,
    ageCategories: stubPopulationDataForSelectedArea.ageCategories,
    femaleSeries: stubPopulationDataForSelectedArea.femaleSeries.map(
      (x) => x * 10
    ),
    maleSeries: stubPopulationDataForSelectedArea.maleSeries.map((x) => x * 10),
  };

  const expectedHeaderCsvRow: CsvField[] = [
    'Indicator ID',
    'Indicator name',
    'Period',
    'Area code',
    'Area name',
    'Age range',
    'Male',
    'Female',
  ];

  const expectedAreaCsvRows: CsvField[][] = [
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A001',
      'area one',
      'oldest',
      5,
      1,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A001',
      'area one',
      'upper middle',
      4,
      2,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A001',
      'area one',
      'middle',
      3,
      3,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A001',
      'area one',
      'lower middle',
      2,
      4,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A001',
      'area one',
      'youngest',
      1,
      5,
    ],
  ];

  const expectedBenchmarkCsvRows: CsvField[][] = [
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A002',
      'benchmark area',
      'oldest',
      500,
      100,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A002',
      'benchmark area',
      'upper middle',
      400,
      200,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A002',
      'benchmark area',
      'middle',
      300,
      300,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A002',
      'benchmark area',
      'lower middle',
      200,
      400,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A002',
      'benchmark area',
      'youngest',
      100,
      500,
    ],
  ];

  const expectedGroupCsvRows: CsvField[][] = [
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A003',
      'group area',
      'oldest',
      50,
      10,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A003',
      'group area',
      'upper middle',
      40,
      20,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A003',
      'group area',
      'middle',
      30,
      30,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A003',
      'group area',
      'lower middle',
      20,
      40,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'A003',
      'group area',
      'youngest',
      10,
      50,
    ],
  ];

  it('should return the correct header and data when passed only healthDataForArea', () => {
    // act
    const actual: CsvField[][] = populationPyramidTableToCsvArray({
      indicatorId: stubIndicatorId,
      indicatorName: stubIndicatorName,
      period: stubPeriod,
      populationDataForArea: stubPopulationDataForSelectedArea,
    });
    // assert
    expect(actual).toEqual([expectedHeaderCsvRow, ...expectedAreaCsvRows]);
  });

  it('should return the correct header and data when passed healthDataForArea and benchmarkData', () => {
    // arrange
    // act
    const actual: CsvField[][] = populationPyramidTableToCsvArray({
      indicatorId: stubIndicatorId,
      indicatorName: stubIndicatorName,
      period: stubPeriod,
      populationDataForArea: stubPopulationDataForSelectedArea,
      populationDataForBenchmark: stubBenchmarkToUse,
    });
    // assert
    expect(actual).toEqual([
      expectedHeaderCsvRow,
      ...expectedBenchmarkCsvRows,
      ...expectedAreaCsvRows,
    ]);
  });

  it('should return the correct header and data when passed healthDataForArea, benchmarkData and groupData', () => {
    // arrange
    // act
    const actual: CsvField[][] = populationPyramidTableToCsvArray({
      indicatorId: stubIndicatorId,
      indicatorName: stubIndicatorName,
      period: stubPeriod,
      populationDataForArea: stubPopulationDataForSelectedArea,
      populationDataForBenchmark: stubBenchmarkToUse,
      populationDataForGroup: stubGroupToUse,
    });
    // assert
    expect(actual).toEqual([
      expectedHeaderCsvRow,
      ...expectedBenchmarkCsvRows,
      ...expectedGroupCsvRows,
      ...expectedAreaCsvRows,
    ]);
  });
});
