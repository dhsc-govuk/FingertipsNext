import { CsvData, CsvRow } from '@/lib/downloadHelpers/convertToCsv';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { BasicTableData } from '@/components/charts/BasicTable/basicTable.types';

export const convertBasicTableToCsvData = (
  rowData: BasicTableData[]
): CsvData => {
  const header: CsvRow = [
    CsvHeader.IndicatorId,
    CsvHeader.IndicatorName,
    CsvHeader.Period,
    CsvHeader.Area,
    CsvHeader.AreaCode,
    CsvHeader.RecentTrend,
    CsvHeader.Count,
    CsvHeader.ValueUnit,
    CsvHeader.Value,
  ];

  const csvData: CsvData = [header];

  rowData.forEach((row) => {
    const csvRow: CsvRow = [
      row.indicatorId,
      row.indicatorName,
      row.period,
      row.areaName,
      row.areaCode,
      row?.trend ?? HealthDataPointTrendEnum.CannotBeCalculated,
      row?.count,
      row.unitLabel,
      row?.value,
    ];

    csvData.push(csvRow);
  });

  return csvData;
};
