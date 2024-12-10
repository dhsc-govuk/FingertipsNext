/* eslint-disable react-hooks/rules-of-hooks */
import SearchPage from './pages/searchPage';
import ResultsPage from './pages/resultsPage';
import { test as baseTest } from '@playwright/test';
import type { TestInfo } from '@playwright/test';

type pages = {
  searchPage: SearchPage;
  resultsPage: ResultsPage;
};

const testBase = baseTest.extend<{ testInfo: TestInfo }>({
  testInfo: [
    async ({}, use, testInfo) => {
      await use(testInfo);
    },
    //Setting auto to true allows each test to use this fixture implicitly rather than setting it explicitly in each test
    { auto: true },
  ],
});

export const test = testBase.extend<pages>({
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  resultsPage: async ({ page }, use) => {
    await use(new ResultsPage(page));
  },
});

export const expect = test.expect;
