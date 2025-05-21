import { InequalitiesTableRowData } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { CsvData } from '@/lib/downloadHelpers/convertToCsv';

export const convertInequalitiesTrendTableToCsvData = (
  tableHeaders: string[],
  tableRows: InequalitiesTableRowData[]
): CsvData => {
  if (tableHeaders.length < 1 || tableRows.length < 1) {
    throw new Error('Invalid data provided.');
  }

  const convertedRows = tableRows.map((tableRow) => {
    const inequalityValues = Object.values(tableRow.inequalities).map(
      (rowData) => rowData?.value
    );

    return [tableRow.period, ...inequalityValues];
  });

  return [tableHeaders, ...convertedRows];
};
