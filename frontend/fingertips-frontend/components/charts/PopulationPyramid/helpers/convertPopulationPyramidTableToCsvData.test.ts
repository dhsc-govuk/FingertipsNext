import { PopulationDataForArea } from './preparePopulationData';
import { convertPopulationPyramidTableToCsvData } from './convertPopulationPyramidTableToCsvData';
import { CsvField, CsvRow } from '@/lib/downloadHelpers/convertToCsv';
import { CsvHeader } from '@/components/molecules/Export/export.types';

describe('PopulationPyramidTableToCsv', () => {
  const stubIndicatorId = 'indicatorId';
  const stubIndicatorName = 'indicatorName';
  const stubPeriod = 2023;

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

  const expectedHeaderCsvRow: CsvRow = [
    CsvHeader.IndicatorId,
    CsvHeader.IndicatorName,
    CsvHeader.Period,
    CsvHeader.Area,
    CsvHeader.AreaCode,
    CsvHeader.AgeRange,
    CsvHeader.Male,
    CsvHeader.Female,
    CsvHeader.Totals,
  ];

  const expectedAreaCsvRows: CsvField[][] = [
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'area one',
      'A001',
      'oldest',
      5,
      1,
      6,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'area one',
      'A001',
      'upper middle',
      4,
      2,
      6,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'area one',
      'A001',

      'middle',
      3,
      3,
      6,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'area one',
      'A001',
      'lower middle',
      2,
      4,
      6,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'area one',
      'A001',
      'youngest',
      1,
      5,
      6,
    ],
  ];

  const expectedBenchmarkCsvRows: CsvField[][] = [
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'benchmark area',
      'A002',
      'oldest',
      500,
      100,
      600,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'benchmark area',
      'A002',
      'upper middle',
      400,
      200,
      600,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'benchmark area',
      'A002',
      'middle',
      300,
      300,
      600,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'benchmark area',
      'A002',
      'lower middle',
      200,
      400,
      600,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'benchmark area',
      'A002',
      'youngest',
      100,
      500,
      600,
    ],
  ];

  const expectedGroupCsvRows: CsvField[][] = [
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'group area',
      'A003',
      'oldest',
      50,
      10,
      60,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'group area',
      'A003',
      'upper middle',
      40,
      20,
      60,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'group area',
      'A003',
      'middle',
      30,
      30,
      60,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'group area',
      'A003',
      'lower middle',
      20,
      40,
      60,
    ],
    [
      stubIndicatorId,
      stubIndicatorName,
      stubPeriod,
      'group area',
      'A003',
      'youngest',
      10,
      50,
      60,
    ],
  ];

  it('should throw an error if IndicatorId is undefined', () => {
    expect(() => {
      convertPopulationPyramidTableToCsvData(
        stubPeriod,
        stubPopulationDataForSelectedArea,
        undefined,
        stubIndicatorName
      );
    }).toThrowError(new Error('IndicatorID and IndicatorName are required'));
  });

  it('should throw an error if IndicatorName is undefined', () => {
    expect(() => {
      convertPopulationPyramidTableToCsvData(
        stubPeriod,
        stubPopulationDataForSelectedArea,
        stubIndicatorId,
        undefined
      );
    }).toThrowError(new Error('IndicatorID and IndicatorName are required'));
  });

  it('should return the correct header and data when passed only healthDataForArea', () => {
    // act
    const actual = convertPopulationPyramidTableToCsvData(
      stubPeriod,
      stubPopulationDataForSelectedArea,
      stubIndicatorId,
      stubIndicatorName
    );
    // assert
    expect(actual).toEqual([expectedHeaderCsvRow, ...expectedAreaCsvRows]);
  });

  it('should return the correct header and data when passed healthDataForArea and benchmarkData', () => {
    // arrange
    // act
    const actual = convertPopulationPyramidTableToCsvData(
      stubPeriod,
      stubPopulationDataForSelectedArea,
      stubIndicatorId,
      stubIndicatorName,
      stubBenchmarkToUse
    );
    // assert
    expect(actual).toEqual([
      expectedHeaderCsvRow,
      ...expectedAreaCsvRows,
      ...expectedBenchmarkCsvRows,
    ]);
  });

  it('should return the correct header and data when passed healthDataForArea, benchmarkData and groupData', () => {
    // arrange
    // act
    const actual = convertPopulationPyramidTableToCsvData(
      stubPeriod,
      stubPopulationDataForSelectedArea,
      stubIndicatorId,
      stubIndicatorName,
      stubBenchmarkToUse,
      stubGroupToUse
    );
    // assert
    expect(actual).toEqual([
      expectedHeaderCsvRow,
      ...expectedAreaCsvRows,
      ...expectedGroupCsvRows.map((row) => {
        row[3] = `Group: ${row[3]}`;
        return row;
      }),
      ...expectedBenchmarkCsvRows,
    ]);
  });
});
