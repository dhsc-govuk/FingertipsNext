import { CsvColumnHeader } from '@/components/molecules/Export/export.types';
import { convertInequalitiesTrendTableToCsvData } from './convertInequalitiesTrendTableToCsvData';

describe('convertInequalitiesTrendTableToCsvData', () => {
  const indicatorId = 41101;
  const indicatorName =
    'Emergency readmissions within 30 days of discharge from hospital';
  const valueUnit = '%';
  const areaCode = 'E12000003';
  const areaName = 'Yorkshire and the Humber Region';
  const inequalityCategory = 'Sex';
  const tableRows = [
    {
      period: 2025,
      inequalities: {
        Male: { value: 27 },
        Female: { value: 42 },
        Persons: { value: 35 },
      },
    },
    {
      period: 2026,
      inequalities: {
        Male: { value: 29 },
        Female: { value: 47 },
        Persons: { value: 39 },
      },
    },
  ];

  it('should contain the expected headers in the first row', () => {
    const csvData = convertInequalitiesTrendTableToCsvData(
      areaCode,
      areaName,
      inequalityCategory,
      tableRows,
      indicatorId,
      indicatorName,
      valueUnit
    );

    expect(csvData[0]).toEqual([
      CsvColumnHeader.IndicatorId,
      CsvColumnHeader.IndicatorName,
      CsvColumnHeader.Period,
      CsvColumnHeader.Area,
      CsvColumnHeader.AreaCode,
      CsvColumnHeader.InequalityCategory,
      CsvColumnHeader.InequalityType,
      CsvColumnHeader.ValueUnit,
      CsvColumnHeader.Value,
    ]);
  });

  it('should include a row for each inequality value for each period', () => {
    const csvData = convertInequalitiesTrendTableToCsvData(
      areaCode,
      areaName,
      inequalityCategory,
      tableRows,
      indicatorId,
      indicatorName,
      valueUnit
    );

    expect(csvData).toHaveLength(7);
    expect(csvData).toContainEqual([
      indicatorId,
      indicatorName,
      2025,
      areaName,
      areaCode,
      inequalityCategory,
      'Male',
      valueUnit,
      27,
    ]);
    expect(csvData).toContainEqual([
      indicatorId,
      indicatorName,
      2025,
      areaName,
      areaCode,
      inequalityCategory,
      'Female',
      valueUnit,
      42,
    ]);
    expect(csvData).toContainEqual([
      indicatorId,
      indicatorName,
      2025,
      areaName,
      areaCode,
      inequalityCategory,
      'Persons',
      valueUnit,
      35,
    ]);
    expect(csvData).toContainEqual([
      indicatorId,
      indicatorName,
      2026,
      areaName,
      areaCode,
      inequalityCategory,
      'Male',
      valueUnit,
      29,
    ]);
    expect(csvData).toContainEqual([
      indicatorId,
      indicatorName,
      2026,
      areaName,
      areaCode,
      inequalityCategory,
      'Female',
      valueUnit,
      47,
    ]);
    expect(csvData).toContainEqual([
      indicatorId,
      indicatorName,
      2026,
      areaName,
      areaCode,
      inequalityCategory,
      'Persons',
      valueUnit,
      39,
    ]);
  });

  it('should use an empty field for missing data', () => {
    const csvData = convertInequalitiesTrendTableToCsvData(
      areaCode,
      areaName,
      inequalityCategory,
      [
        {
          period: 2025,
          inequalities: {
            Male: undefined,
            Female: { value: undefined },
            Persons: { value: 35 },
          },
        },
      ]
    );

    expect(csvData).toHaveLength(4);
    expect(csvData).toContainEqual([
      undefined,
      undefined,
      2025,
      areaName,
      areaCode,
      inequalityCategory,
      'Male',
      undefined,
      undefined,
    ]);
    expect(csvData).toContainEqual([
      undefined,
      undefined,
      2025,
      areaName,
      areaCode,
      inequalityCategory,
      'Female',
      undefined,
      undefined,
    ]);
    expect(csvData).toContainEqual([
      undefined,
      undefined,
      2025,
      areaName,
      areaCode,
      inequalityCategory,
      'Persons',
      undefined,
      35,
    ]);
  });

  it('should throw an error if no data rows are provided', () => {
    expect(() => {
      convertInequalitiesTrendTableToCsvData(
        areaCode,
        areaName,
        inequalityCategory,
        [],
        indicatorId,
        indicatorName,
        valueUnit
      );
    }).toThrow();
  });
});
