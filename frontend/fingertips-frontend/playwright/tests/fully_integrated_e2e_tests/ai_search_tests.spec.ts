import { SearchMode } from '@/playwright/testHelpers';
import { test } from '../../page-objects/pageFactory';
import { AreaDocument } from '@/lib/search/searchTypes';

const areaSearchTerm: AreaDocument = {
  areaCode: 'E12000002',
  areaType: 'Regions',
  areaName: 'North West Region',
};

test.describe('Area search suggestions', () => {
  test('suggestion panel should return only expected area when there is a full match for area code', async ({
    homePage,
  }) => {
    await homePage.navigateToHomePage();
    await homePage.checkOnHomePage();

    await homePage.checkAreaSuggestionPanelContainsItems(
      areaSearchTerm.areaCode,
      [areaSearchTerm.areaName]
    );
  });
});

test.describe('Indicator search', () => {
  test('searching by indicator id absent from any indicator title should only return one result', async ({
    homePage,
    resultsPage,
  }) => {
    const indicatorSearchTerm = '12345';

    await homePage.navigateToHomePage();
    await homePage.checkOnHomePage();
    await homePage.searchForIndicators(
      SearchMode.ONLY_SUBJECT,
      indicatorSearchTerm
    );
    await homePage.clickSearchButton();

    await resultsPage.verifyNumberOfResults(1);
  });

  test('searching by exact indicator title should return that indicator as the first result', async ({
    homePage,
    resultsPage,
  }) => {
    const indicatorSearchTerm =
      'Emergency hospital admissions due to falls aged 65 years and over';

    await homePage.navigateToHomePage();
    await homePage.checkOnHomePage();
    await homePage.searchForIndicators(
      SearchMode.ONLY_SUBJECT,
      indicatorSearchTerm
    );
    await homePage.clickSearchButton();

    await resultsPage.verifyFirstResultHasName(indicatorSearchTerm);
  });

  test('searching by ', async ({ homePage, resultsPage }) => {
    const indicatorSearchTerm = 'Alzheimers';

    await homePage.navigateToHomePage();
    await homePage.checkOnHomePage();
    await homePage.searchForIndicators(
      SearchMode.ONLY_SUBJECT,
      indicatorSearchTerm
    );
    await homePage.clickSearchButton();

    await resultsPage.verifyResultsContainText("Alzheimer's");
  });
});
