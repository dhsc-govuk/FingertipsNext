import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
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

  it('should throw an error if IndicatorName is undefiend', () => {
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
      ...expectedBenchmarkCsvRows,
      ...expectedAreaCsvRows,
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
      ...expectedBenchmarkCsvRows,
      ...expectedGroupCsvRows,
      ...expectedAreaCsvRows,
    ]);
  });
});
