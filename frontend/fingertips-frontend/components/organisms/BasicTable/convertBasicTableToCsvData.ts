import { CsvData, CsvRow } from '@/lib/downloadHelpers/convertToCsv';
import { BasicTableData } from '.';
import { CsvHeader } from '@/components/molecules/Export/export.types';
import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

export const convertBasicTableToCsvData = (
  indicatorData: BasicTableData[]
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

  indicatorData.forEach((indicator) => {
    const csvRow: CsvRow = [
      indicator.indicatorId,
      indicator.indicatorName,
      indicator.period,
      'England',
      areaCodeForEngland,
      indicator.latestEnglandHealthData?.trend ??
        HealthDataPointTrendEnum.CannotBeCalculated,
      indicator.latestEnglandHealthData?.count,
      indicator.unitLabel,
      indicator.latestEnglandHealthData?.value,
    ];

    csvData.push(csvRow);
  });

  return csvData;
};
