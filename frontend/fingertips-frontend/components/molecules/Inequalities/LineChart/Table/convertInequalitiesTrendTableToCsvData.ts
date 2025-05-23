import { CsvHeader } from '@/components/molecules/Export/export.types';
import { InequalitiesTableRowData } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';

const headers: CsvHeader[] = [
  CsvHeader.IndicatorId,
  CsvHeader.IndicatorName,
  CsvHeader.Period,
  CsvHeader.Area,
  CsvHeader.AreaCode,
  CsvHeader.InequalityCategory,
  CsvHeader.InequalityType,
  CsvHeader.ValueUnit,
  CsvHeader.Value,
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
