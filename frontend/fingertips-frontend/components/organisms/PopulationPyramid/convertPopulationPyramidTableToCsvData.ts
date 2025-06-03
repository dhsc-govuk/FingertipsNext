import { CsvHeader } from '@/components/molecules/Export/export.types';
import { PopulationDataForArea } from '@/lib/chartHelpers/preparePopulationData';
import { CsvData, CsvRow } from '@/lib/downloadHelpers/convertToCsv';

export function convertPopulationPyramidTableToCsvData(
  period: number,
  populationDataForArea: PopulationDataForArea,
  indicatorId?: string,
  indicatorName?: string,
  populationDataForBenchmark?: PopulationDataForArea,
  populationDataForGroup?: PopulationDataForArea
): CsvData {
  if (!indicatorId || !indicatorName) {
    throw new Error('IndicatorID and IndicatorName are required');
  }
  const header: CsvRow = [
    CsvHeader.IndicatorId,
    CsvHeader.IndicatorName,
    CsvHeader.Period,
    CsvHeader.Area,
    CsvHeader.AreaCode,
    CsvHeader.AgeRange,
    CsvHeader.Male,
    CsvHeader.Female,
  ];

  const rows: CsvData = [];
  if (populationDataForBenchmark)
    rows.push(
      ...convertPopulationPyramidTableAreaToCsvRow(
        indicatorId,
        indicatorName,
        period,
        populationDataForBenchmark
      )
    );
  if (populationDataForGroup)
    rows.push(
      ...convertPopulationPyramidTableAreaToCsvRow(
        indicatorId,
        indicatorName,
        period,
        populationDataForGroup
      )
    );
  rows.push(
    ...convertPopulationPyramidTableAreaToCsvRow(
      indicatorId,
      indicatorName,
      period,
      populationDataForArea
    )
  );

  return [header, ...rows];
}
function convertPopulationPyramidTableAreaToCsvRow(
  indicatorId: string,
  indicatorName: string,
  period: number,
  populationDataForArea: PopulationDataForArea
): CsvData {
  return populationDataForArea.ageCategories.map((ageCategory, i) => [
    indicatorId,
    indicatorName,
    period,
    populationDataForArea.areaName,
    populationDataForArea.areaCode,
    ageCategory,
    populationDataForArea.maleSeries[i],
    populationDataForArea.femaleSeries[i],
  ]);
}
