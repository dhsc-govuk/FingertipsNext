import { CsvData, CsvRow } from '@/lib/downloadHelpers/convertToCsv';
import { BasicTableData } from '.';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';

export const convertBasicTableToCsvData = (
  indicatorData: BasicTableData[]
): CsvData => {
  const header: CsvRow = [
    CsvHeader.IndicatorId,
    CsvHeader.IndicatorName,
    CsvHeader.Period,
    CsvHeader.Count,
    CsvHeader.ValueUnit,
    CsvHeader.Value,
    CsvHeader.RecentTrend,
  ];

  const csvData: CsvData = [header];

  indicatorData.forEach((indicator) => {
    const csvRow: CsvRow = [
      indicator.indicatorId,
      indicator.indicatorName,
      indicator.period,
      indicator.latestEnglandHealthData?.count,
      indicator.unitLabel,
      indicator.latestEnglandHealthData?.value,
      indicator.latestEnglandHealthData?.trend ??
        HealthDataPointTrendEnum.CannotBeCalculated,
    ];

    csvData.push(csvRow);
  });

  return csvData;
};
