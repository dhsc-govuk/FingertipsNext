import fs from 'fs/promises';
import path from 'path';
import looksSame from 'looks-same';
import type { Locator, Page } from '@playwright/test';

/**
 * Compares screenshots using looks-same library
 */
async function compareWithLooksSame(
  elementScreenshot: Buffer,
  screenshotName: string,
  options: {
    tolerance?: number;
    ignoreCaret?: boolean;
    ignoreAntialiasing?: boolean;
    createDiffImage?: boolean;
    diffDir?: string;
    baselineDir?: string;
    screenshotsDir?: string;
    antialiasingTolerance?: number;
  } = {}
) {
  // Set defaults
  const {
    tolerance = 7.5,
    ignoreCaret = true,
    ignoreAntialiasing = true,
    createDiffImage = true,
    diffDir = './test-results/screenshot-diffs/',
    baselineDir = './test-results/screenshot-baseline/',
    screenshotsDir = './test-results/screenshots/',
    antialiasingTolerance = 40,
  } = options;

  // Create directories if they don't exist
  await fs.mkdir(diffDir, { recursive: true }).catch(() => {});
  await fs.mkdir(baselineDir, { recursive: true }).catch(() => {});
  await fs.mkdir(screenshotsDir, { recursive: true }).catch(() => {});

  // Save the current screenshot
  const screenshotPath = path.join(screenshotsDir, screenshotName);
  await fs.writeFile(screenshotPath, elementScreenshot);

  // Path to the baseline screenshot
  const baselinePath = path.join(baselineDir, screenshotName);

  // Check if baseline exists
  let baselineExists = false;
  try {
    await fs.access(baselinePath);
    baselineExists = true;
  } catch {
    // Baseline doesn't exist
    baselineExists = false;
  }

  // If baseline doesn't exist, create it
  if (!baselineExists) {
    await fs.writeFile(baselinePath, elementScreenshot);
    console.log(
      `Created new baseline: ${screenshotName} as a baseline image did not exist.`
    );
    return true;
  }

  // Compare screenshots using looks-same
  try {
    const result = await looksSame(screenshotPath, baselinePath, {
      tolerance,
      ignoreCaret,
      ignoreAntialiasing,
      antialiasingTolerance,
    });

    if (!result.equal && createDiffImage) {
      // Create a diff image if comparison fails
      const diffPath = path.join(diffDir, `diff-${screenshotName}`);
      await looksSame.createDiff({
        reference: baselinePath,
        current: screenshotPath,
        diff: diffPath,
        highlightColor: '#FF0000', // Red highlight for differences
      });
      console.log(`Created diff image: ${diffPath}`);
    }

    return result.equal;
  } catch (error) {
    console.error('Screenshot comparison error:', error);
    return false;
  }
}

/**
 * Extend Playwright's expect with a custom matcher for looks-same
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addLooksSameMatcher(expect: any) {
  expect.extend({
    async toMatchScreenshotWithLooksSame(
      received: Locator | Page,
      screenshotName: string,
      options?: Parameters<typeof compareWithLooksSame>[2]
    ) {
      if (!received || typeof received.screenshot !== 'function') {
        return {
          message: () =>
            'Invalid object provided. Expected Playwright Locator or Page.',
          pass: false,
        };
      }

      // Take the screenshot
      const screenshot = await received.screenshot();

      // Compare with looks-same
      const result = await compareWithLooksSame(
        screenshot,
        screenshotName,
        options
      );

      return {
        message: () =>
          result
            ? `Expected screenshots to be different, but they look the same`
            : `Expected screenshots to look the same, but they are different`,
        pass: result,
      };
    },
  });
}
