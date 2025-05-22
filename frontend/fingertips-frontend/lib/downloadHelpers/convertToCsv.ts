import { PopulationDataForArea } from '../chartHelpers/preparePopulationData';

const lineBreak = '\r\n';
const delimiter = ',';

export type CsvField = string | number | undefined | null;
export type CsvRow = CsvField[];
export type CsvData = CsvRow[];

export const convertFieldToCsv = (field: CsvField): string => {
  if (field === undefined || field === null) return '';
  const fieldStringRaw = String(field);
  const fieldString = fieldStringRaw.replace(/[\n\r]/g, '');
  const needsQuotes = /[",]/.test(fieldString);
  const escapedField = fieldString.replace(/"/g, '""');
  return needsQuotes ? `"${escapedField}"` : escapedField;
};

export const convertRowToCsv = (row: CsvRow): string =>
  row.map(convertFieldToCsv).join(delimiter);

export const convertToCsv = (data: CsvData): string =>
  data.map(convertRowToCsv).join(lineBreak).trim();

export function populationPyramidTableToCsvArray({
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

  const rows: CsvField[][] = populationPyramidTableAreaToCsvArray(
    indicatorId,
    indicatorName,
    period,
    populationDataForArea
  );
  if (populationDataForBenchmark)
    rows.push(
      ...populationPyramidTableAreaToCsvArray(
        indicatorId,
        indicatorName,
        period,
        populationDataForBenchmark
      )
    );
  if (populationDataForGroup)
    rows.push(
      ...populationPyramidTableAreaToCsvArray(
        indicatorId,
        indicatorName,
        period,
        populationDataForGroup
      )
    );

  return [header, ...rows];
}

function populationPyramidTableAreaToCsvArray(
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
