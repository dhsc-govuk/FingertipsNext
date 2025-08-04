import { CsvHeader } from '@/components/molecules/Export/export.types';
import { PopulationDataForArea } from '@/components/charts/PopulationPyramid/helpers/preparePopulationData';
import { CsvData, CsvRow } from '@/lib/downloadHelpers/convertToCsv';

export function convertPopulationPyramidTableToCsvData(
  period: number,
  populationDataForArea?: PopulationDataForArea,
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
    CsvHeader.Totals,
  ];

  const rows: CsvData = [];

  if (populationDataForArea) {
    rows.push(
      ...convertPopulationPyramidTableAreaToCsvRow(
        indicatorId,
        indicatorName,
        period,
        populationDataForArea
      )
    );
  }
  if (populationDataForGroup) {
    const groupRows = convertPopulationPyramidTableAreaToCsvRow(
      indicatorId,
      indicatorName,
      period,
      populationDataForGroup
    ).map((row) => {
      const groupRow = [...row];
      groupRow[3] = `Group: ${groupRow[3]}`;
      return groupRow;
    });

    rows.push(...groupRows);
  }

  if (populationDataForBenchmark)
    rows.push(
      ...convertPopulationPyramidTableAreaToCsvRow(
        indicatorId,
        indicatorName,
        period,
        populationDataForBenchmark
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
    populationDataForArea.maleSeries[i] + populationDataForArea.femaleSeries[i],
  ]);
}
