import { test } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';
import { ExportType } from '@/components/molecules/Export/export.types';
import { AreaMode, IndicatorMode } from './testEnums';

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
