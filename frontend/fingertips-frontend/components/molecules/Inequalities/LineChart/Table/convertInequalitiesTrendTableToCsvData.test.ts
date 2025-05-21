import { convertInequalitiesTrendTableToCsvData } from './convertInequalitiesTrendTableToCsvData';

describe('convertInequalitiesTrendTableToCsvData', () => {
  const tableHeaders = ['Period', 'Male', 'Female', 'Persons'];
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

  it('should use headings as the first row, if provided', () => {
    const csvData = convertInequalitiesTrendTableToCsvData(
      tableHeaders,
      tableRows
    );

    expect(csvData[0]).toEqual(tableHeaders);
  });

  it('should throw an error if no headings are provided', () => {
    expect(() => {
      convertInequalitiesTrendTableToCsvData([], tableRows);
    }).toThrow();
  });

  it('should include a row for each table row', () => {
    const csvData = convertInequalitiesTrendTableToCsvData(
      tableHeaders,
      tableRows
    );

    expect(csvData).toHaveLength(3);
    expect(csvData[1]).toEqual([2025, 27, 42, 35]);
    expect(csvData[2]).toEqual([2026, 29, 47, 39]);
  });

  it('should use an empty field for missing data', () => {
    const csvData = convertInequalitiesTrendTableToCsvData(tableHeaders, [
      {
        period: 2025,
        inequalities: {
          Male: undefined,
          Female: { value: undefined },
          Persons: { value: 35 },
        },
      },
      {
        period: 2026,
        inequalities: {
          Male: { value: 29 },
          Female: undefined,
          Persons: { value: undefined },
        },
      },
    ]);

    expect(csvData).toHaveLength(3);
    expect(csvData[1]).toEqual([2025, undefined, undefined, 35]);
    expect(csvData[2]).toEqual([2026, 29, undefined, undefined]);
  });

  it('should throw an error if no data rows are provided', () => {
    expect(() => {
      convertInequalitiesTrendTableToCsvData(
        ['First Header', 'Second Header', 'Third Header'],
        []
      );
    }).toThrow();
  });
});
