import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  convertFieldToCsv,
  convertRowToCsv,
  convertToCsv,
  CsvField,
  PopulationPyramidTableToCsv,
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

  const expectedHeaderCsvRow: CsvField[] = [
    'Area code',
    'Area name',
    'Age range',
    'Male',
    'Female',
  ];

  const expectedAreaCsvRows: CsvField[][] = [
    ['A001', 'area one', 'oldest', 5, 1],
    ['A001', 'area one', 'upper middle', 4, 2],
    ['A001', 'area one', 'middle', 3, 3],
    ['A001', 'area one', 'lower middle', 2, 4],
    ['A001', 'area one', 'youngest', 1, 5],
  ];

  it('should return the correct header and data when passed only healthDataForArea', () => {
    // arrange
    const expectedCsvRowsForArea: CsvField[][] = [[]];
    // act
    const actual: CsvField[][] = PopulationPyramidTableToCsv(
      stubPopulationDataForSelectedArea
    );
    // assert
    expect(actual[0]).toEqual(expectedHeaderCsvRow);
    expect(actual.slice(1)).toEqual(expectedAreaCsvRows);
  });
});
