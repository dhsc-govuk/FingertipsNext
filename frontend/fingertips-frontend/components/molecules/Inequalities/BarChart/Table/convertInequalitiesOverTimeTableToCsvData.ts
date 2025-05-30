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

  const convertedRows = sortedKeys.map((inequalityType) => {
    if (!Object.hasOwn(tableData.data.inequalities, inequalityType)) {
      throw new Error(
        `Cannot find inequality type ${inequalityType} in provided data`
      );
    }

    const inequalityData = tableData.data.inequalities[inequalityType];

    return [
      indicatorMetadata?.indicatorID,
      indicatorMetadata?.indicatorName,
      tableData.data.period,
      tableData.areaName,
      tableData.areaCode,
      inequalityCategory,
      inequalityType,
      // Aggregate data points are the Persons data, so shouldn't include a benchmark comparison.
      inequalityData?.isAggregate
        ? undefined
        : inequalityData?.benchmarkComparison?.outcome,
      inequalityData?.count,
      indicatorMetadata?.unitLabel,
      inequalityData?.value,
      inequalityData?.lower,
      inequalityData?.upper,
    ];
  });

  return [headers, ...convertedRows];
};
