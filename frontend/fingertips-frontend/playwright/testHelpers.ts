import AxeBuilder from '@axe-core/playwright';
import { expect } from './page-objects/pageFactory';
import { IndicatorMode } from './page-objects/pages/chartPage';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

interface CSVIndicator {
  IndicatorID: string;
  IndicatorName: string;
}

const parseCsvToJson = (filePath: string): CSVIndicator[] => {
  const fileContent = fs.readFileSync(path.resolve(filePath), 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    trim: true,
    skip_empty_lines: true,
    bom: true,
  }) as CSVIndicator[];

  return records;
};

function filterIndicatorsByName(
  indicators: CSVIndicator[],
  searchTerm: string
): CSVIndicator[] {
  if (!searchTerm) return [];

  const normalizedSearchTerm = searchTerm.toLowerCase();
  return indicators.filter((indicator) =>
    indicator.IndicatorName.toLowerCase().includes(normalizedSearchTerm)
  );
}

export function getAllIndicatorIdsForSearchTerm(
  pathToIndicatorsCSV: string,
  searchTerm: string
): string[] {
  const indicators = parseCsvToJson(pathToIndicatorsCSV);
  return filterIndicatorsByName(indicators, searchTerm).map(
    (indicator) => indicator['IndicatorID']
  );
}

export function returnIndicatorIDsByIndicatorMode(
  indicators: string[],
  indicatorMode: IndicatorMode
): string[] {
  switch (indicatorMode) {
    case IndicatorMode.ONE_INDICATOR:
      return [indicators[0]];
    case IndicatorMode.TWO_INDICATORS:
      return [indicators[0], indicators[1]];
    case IndicatorMode.MULTIPLE_INDICATORS: // 3+ indicators
      return [indicators[0], indicators[1], indicators[2]];
    default:
      throw new Error('Invalid indicator mode');
  }
}

export async function expectNoAccessibilityViolations(axeBuilder: AxeBuilder) {
  expect((await axeBuilder.analyze()).violations).toEqual([]);
}
