import { CsvColumnHeader } from '@/components/molecules/Export/export.types';
import { InequalitiesTableRowData } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';

const headers: CsvColumnHeader[] = [
  CsvColumnHeader.IndicatorId,
  CsvColumnHeader.IndicatorName,
  CsvColumnHeader.Period,
  CsvColumnHeader.Area,
  CsvColumnHeader.AreaCode,
  CsvColumnHeader.InequalityCategory,
  CsvColumnHeader.InequalityType,
  CsvColumnHeader.ValueUnit,
  CsvColumnHeader.Value,
];

export const convertInequalitiesTrendTableToCsvData = (
  areaCode: string,
  areaName: string,
  inequalityCategory: string,
  tableRows: InequalitiesTableRowData[],
  indicatorId?: number,
  indicatorName?: string,
  valueUnit?: string
): CsvData => {
  if (tableRows.length < 1) {
    throw new Error('Invalid data provided.');
  }

  const convertedRows = tableRows.flatMap((tableRow) => {
    return Object.entries(tableRow.inequalities).map(
      ([inequalityType, rowData]) => {
        return [
          indicatorId,
          indicatorName,
          tableRow.period,
          areaName,
          areaCode,
          inequalityCategory,
          inequalityType,
          valueUnit,
          rowData?.value,
        ];
      }
    );
  });

  return [headers, ...convertedRows];
};
