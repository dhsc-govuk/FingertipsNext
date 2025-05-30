import { CsvHeader } from '@/components/molecules/Export/export.types';
import { convertInequalitiesOverTimeTableToCsvData } from './convertInequalitiesOverTimeTableToCsvData';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { InequalitiesTableRowData } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { BenchmarkOutcome } from '@/generated-sources/ft-api-client';

describe('convertInequalitiesOverTimeTableToCsvData', () => {
  const indicatorId = 41101;
  const indicatorName =
    'Emergency readmissions within 30 days of discharge from hospital';
  const valueUnit = '%';
  const indicatorMetadata = {
    indicatorID: indicatorId,
    indicatorName,
    unitLabel: valueUnit,
  } as unknown as IndicatorDocument;
  const areaCode = 'E12000003';
  const areaName = 'Yorkshire and the Humber Region';
  const inequalityCategory = 'Sex';
  const sortedKeys = ['Persons', 'Male', 'Female'];
  const tableData: InequalitiesTableRowData = {
    period: 2026,
    inequalities: {
      Male: {
        isAggregate: false,
        count: 13,
        value: 29,
        lower: 27,
        upper: 31,
        benchmarkComparison: { outcome: 'Better' },
      },
      Female: {
        isAggregate: false,
        count: 14,
        value: 47,
        lower: 45,
        upper: 49,
        benchmarkComparison: { outcome: 'Similar' },
      },
      Persons: {
        isAggregate: true,
        count: 15,
        value: 39,
        lower: 37,
        upper: 41,
        // Aggregate data points are benchmarked against the benchmark area, not Persons
        benchmarkComparison: { outcome: 'Worse' },
      },
    },
  };

  it('should contain the expected headers in the first row', () => {
    const csvData = convertInequalitiesOverTimeTableToCsvData(
      sortedKeys,
      { areaCode, areaName, data: tableData },
      inequalityCategory,
      95,
      indicatorMetadata
    );

    expect(csvData[0]).toEqual([
      CsvHeader.IndicatorId,
      CsvHeader.IndicatorName,
      CsvHeader.Period,
      CsvHeader.Area,
      CsvHeader.AreaCode,
      CsvHeader.InequalityCategory,
      CsvHeader.InequalityType,
      CsvHeader.PersonsComparison,
      CsvHeader.Count,
      CsvHeader.ValueUnit,
      CsvHeader.Value,
      CsvHeader.LowerCI.replace('X', '95'),
      CsvHeader.UpperCI.replace('X', '95'),
    ]);
  });

  it('should include a row for each inequality value', () => {
    const csvData = convertInequalitiesOverTimeTableToCsvData(
      sortedKeys,
      { areaCode, areaName, data: tableData },
      inequalityCategory,
      95,
      indicatorMetadata
    );

    expect(csvData).toHaveLength(4);

    const maleInequality = tableData.inequalities['Male'];
    expect(csvData).toContainEqual([
      indicatorId,
      indicatorName,
      2026,
      areaName,
      areaCode,
      inequalityCategory,
      'Male',
      BenchmarkOutcome.Better,
      maleInequality?.count,
      valueUnit,
      maleInequality?.value,
      maleInequality?.lower,
      maleInequality?.upper,
    ]);

    const femaleInequality = tableData.inequalities['Female'];
    expect(csvData).toContainEqual([
      indicatorId,
      indicatorName,
      2026,
      areaName,
      areaCode,
      inequalityCategory,
      'Female',
      BenchmarkOutcome.Similar,
      femaleInequality?.count,
      valueUnit,
      femaleInequality?.value,
      femaleInequality?.lower,
      femaleInequality?.upper,
    ]);

    const personsInequality = tableData.inequalities['Persons'];
    expect(csvData).toContainEqual([
      indicatorId,
      indicatorName,
      2026,
      areaName,
      areaCode,
      inequalityCategory,
      'Persons',
      undefined, // The persons value should not show a comparison against persons
      personsInequality?.count,
      valueUnit,
      personsInequality?.value,
      personsInequality?.lower,
      personsInequality?.upper,
    ]);
  });

  it('should use an empty field for missing data', () => {
    const csvData = convertInequalitiesOverTimeTableToCsvData(
      sortedKeys,
      {
        areaCode,
        areaName,
        data: {
          period: 2025,
          inequalities: {
            Male: undefined,
            Female: { value: undefined },
            Persons: {
              count: 34,
              value: 35,
              lower: 33,
              upper: 37,
              isAggregate: true,
              benchmarkComparison: { outcome: BenchmarkOutcome.Similar },
            },
          },
        },
      },
      inequalityCategory,
      95
    );

    expect(csvData).toHaveLength(4);
    expect(csvData).toContainEqual([
      undefined, // Indicator ID
      undefined, // Indicator name
      2025,
      areaName,
      areaCode,
      inequalityCategory,
      'Male',
      undefined, // Compared to persons
      undefined, // Count
      undefined, // Value unit
      undefined, // Value
      undefined, // Lower CI
      undefined, // Upper CI
    ]);
    expect(csvData).toContainEqual([
      undefined, // Indicator ID
      undefined, // Indicator name
      2025,
      areaName,
      areaCode,
      inequalityCategory,
      'Female',
      undefined, // Compared to persons
      undefined, // Count
      undefined, // Value unit
      undefined, // Value
      undefined, // Lower CI
      undefined, // Upper CI
    ]);
    expect(csvData).toContainEqual([
      undefined, // Indicator ID
      undefined, // Indicator name
      2025,
      areaName,
      areaCode,
      inequalityCategory,
      'Persons',
      undefined, // Compared to persons
      34, // Count
      undefined, // Value unit
      35, // Value
      33, // Lower CI
      37, // Upper CI
    ]);
  });

  it('should throw an error if no inequaliities are provided', () => {
    expect(() => {
      convertInequalitiesOverTimeTableToCsvData(
        sortedKeys,
        {
          areaCode,
          areaName,
          data: {
            period: 2025,
            inequalities: {},
          },
        },
        inequalityCategory,
        95,
        indicatorMetadata
      );
    }).toThrow();
  });

  it('should order the inequality rows as specified', () => {
    const csvData = convertInequalitiesOverTimeTableToCsvData(
      ['Male', 'Persons', 'Female'],
      { areaCode, areaName, data: tableData },
      inequalityCategory,
      95,
      indicatorMetadata
    );

    expect(csvData[1][6]).toEqual('Male');
    expect(csvData[2][6]).toEqual('Persons');
    expect(csvData[3][6]).toEqual('Female');
  });

  it('should omit rows for inequality keys that do not match the inequality data provided', () => {
    const csvData = convertInequalitiesOverTimeTableToCsvData(
      ['Persons', 'Not Real', 'Male'],
      { areaCode, areaName, data: tableData },
      inequalityCategory,
      95,
      indicatorMetadata
    );

    expect(csvData).toHaveLength(3); // Header + 2 rows
    expect(csvData[1][6]).toEqual('Persons');
    expect(csvData[2][6]).toEqual('Male');
  });
});
