import { PopulationDataForArea } from '../../../lib/chartHelpers/preparePopulationData';
import { CsvField } from '../../../lib/downloadHelpers/convertToCsv';

export function convertPopulationPyramidTableToCsvData({
  indicatorId,
  indicatorName,
  period,
  populationDataForArea,
  populationDataForBenchmark,
  populationDataForGroup,
}: {
  indicatorId: string;
  indicatorName: string;
  period: string;
  populationDataForArea: PopulationDataForArea;
  populationDataForBenchmark?: PopulationDataForArea;
  populationDataForGroup?: PopulationDataForArea;
}): CsvField[][] {
  const header: CsvField[] = [
    'Indicator ID',
    'Indicator name',
    'Period',
    'Area code',
    'Area name',
    'Age range',
    'Male',
    'Female',
  ];

  const rows: CsvField[][] = [];
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
  period: string,
  populationDataForArea: PopulationDataForArea
): CsvField[][] {
  return populationDataForArea.ageCategories.map((ageCategory, i) => [
    indicatorId,
    indicatorName,
    period,
    populationDataForArea.areaCode,
    populationDataForArea.areaName,
    ageCategory,
    populationDataForArea.maleSeries[i],
    populationDataForArea.femaleSeries[i],
  ]);
}
