import { CsvHeader } from '@/components/molecules/Export/export.types';
import { InequalitiesBarChartData } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { CsvData, CsvRow } from '@/lib/downloadHelpers/convertToCsv';
import { IndicatorDocument } from '@/lib/search/searchTypes';

export const convertInequalitiesOverTimeTableToCsvData = (
  sortedKeys: string[],
  tableData: InequalitiesBarChartData,
  inequalityCategory: string,
  confidenceLimit: number,
  indicatorMetadata?: IndicatorDocument
): CsvData => {
  if (Object.keys(tableData.data.inequalities).length < 1) {
    throw new Error('Inequalities must be provided.');
  }

  const headers: CsvRow = [
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
    CsvHeader.LowerCI.replace('X', String(confidenceLimit)),
    CsvHeader.UpperCI.replace('X', String(confidenceLimit)),
  ];

  const convertedRows: CsvData = [headers];

  sortedKeys.forEach((inequalityKey) => {
    if (!Object.hasOwn(tableData.data.inequalities, inequalityKey)) {
      return;
    }

    const inequalityData = tableData.data.inequalities[inequalityKey];
    convertedRows.push([
      indicatorMetadata?.indicatorID,
      indicatorMetadata?.indicatorName,
      tableData.data.period,
      tableData.areaName,
      tableData.areaCode,
      inequalityCategory,
      inequalityKey,
      // Aggregate data points are the Persons data, so shouldn't include a benchmark comparison.
      inequalityData?.isAggregate
        ? undefined
        : inequalityData?.benchmarkComparison?.outcome,
      inequalityData?.count,
      indicatorMetadata?.unitLabel,
      inequalityData?.value,
      inequalityData?.lower,
      inequalityData?.upper,
    ]);
  });

  return convertedRows;
};
