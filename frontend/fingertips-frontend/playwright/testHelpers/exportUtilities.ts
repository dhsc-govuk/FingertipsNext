import { Download, Locator, test } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';
import { ExportType } from '@/components/molecules/Export/export.types';
import {
  AreaMode,
  ChartComponentDefinition,
  IndicatorMode,
  SimpleIndicatorDocument,
} from './testDefinitions';
import { expect } from '../page-objects/pageFactory';
import { XMLParser } from 'fast-xml-parser';
import ChartPage from '../page-objects/pages/chartPage';

export const createDownloadPath = async (
  exportType: ExportType,
  areaMode: AreaMode,
  indicatorMode: IndicatorMode
): Promise<string> => {
  // Create download directory structure
  const projectName = test.info().project.name;
  const downloadDir = path.join(
    process.cwd(),
    '.test',
    'spec',
    'exports',
    exportType,
    projectName,
    `${areaMode}-${indicatorMode}`
  );

  // Ensure directory exists
  await fs.mkdir(downloadDir, { recursive: true });

  return downloadDir;
};

export const verifySVGDownloadMatchesPreview = async (
  downloadPath: string,
  exportModalPreview: Locator
): Promise<void> => {
  const svgFileContent = await fs.readFile(downloadPath, 'utf-8');
  const previewSVG = await exportModalPreview.innerHTML();

  // normalise the SVG content in preview and download by removing xmlns attributes
  const reg = /xmlns(:xlink)?="[^"]+" /g;
  const previewSVGwithoutXlmns = previewSVG.replaceAll(reg, '');
  const svgFileContentWithoutXlmns = svgFileContent.replaceAll(reg, '');

  expect(
    compareXmlStrings(previewSVGwithoutXlmns, svgFileContentWithoutXlmns)
  ).toBe(true);
};

const compareXmlStrings = (str1: string, str2: string) => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    ignoreDeclaration: true,
    attributeNamePrefix: '',
    trimValues: true,
  });
  const json1 = parser.parse(str1);
  const json2 = parser.parse(str2);
  return JSON.stringify(json1) === JSON.stringify(json2);
};

export const copySavedFileIntoDirectory = async (
  downloadDir: string,
  downloadPromise: Promise<Download>
): Promise<{ download: Download; downloadPath: string }> => {
  const download = await downloadPromise;
  const filename = download.suggestedFilename();
  const downloadPath = path.join(downloadDir, filename);

  // move the downloaded file to the specified directory
  await download.saveAs(downloadPath);

  // Delete the original download if it exists
  try {
    await download.delete();
  } catch {
    // Ignore if already deleted or doesn't exist
  }

  return { download, downloadPath };
};

export const verifyCSVDownloadMatchesPreview = async (
  downloadPath: string,
  exportModalPreview: Locator
): Promise<void> => {
  // Ensure the file exists and has content
  const fileInfo = await fs.stat(downloadPath);
  expect(fileInfo.size).toBeGreaterThan(100);

  // validate that the CSV file content matches the modal preview
  const fileContent = await fs.readFile(downloadPath, 'utf-8');
  const modalPreviewText = await exportModalPreview.textContent();
  expect(fileContent).toContain(modalPreviewText);
};

export const getExpectedCSVIndicatorData = (
  component: ChartComponentDefinition,
  selectedIndicators: SimpleIndicatorDocument[]
): {
  expectedCsvIndicatorID: number | string;
  expectedCsvIndicatorName: string;
} => {
  const isPopulationPyramid =
    component.chartComponentLocator ===
    ChartPage.populationPyramidTableComponent;

  return {
    expectedCsvIndicatorID: isPopulationPyramid
      ? 92708
      : selectedIndicators[0].indicatorID,
    expectedCsvIndicatorName: isPopulationPyramid
      ? 'Resident population'
      : selectedIndicators[0].indicatorName,
  };
};
