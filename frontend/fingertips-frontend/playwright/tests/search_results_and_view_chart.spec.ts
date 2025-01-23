import { SearchParams } from '@/lib/searchStateManager';
import { expect, test } from '../page-objects/pageFactory';

const indicator = '123';

test('Search via indicator and assert displayed results, check the chart is displayed then navigate back through to search page', async ({
  homePage,
  resultsPage,
  chartPage,
  axeBuilder,
}) => {
  // Arrange
  await homePage.navigateToSearch();

  // Assert
  await homePage.checkURLIsCorrect();
  expect((await axeBuilder.analyze()).violations).toEqual([]);

  // Act
  await homePage.typeIndicator(indicator);
  await homePage.clickSearchButton();

  // Assert
  await resultsPage.checkURLIsCorrect(indicator);
  expect((await axeBuilder.analyze()).violations).toEqual([]);
  await resultsPage.checkSearchResults(indicator);

  // Act
  await resultsPage.clickIndicatorCheckbox('1');
  await resultsPage.clickIndicatorCheckbox('2');
  await resultsPage.clickViewChartsButton();

  // Assert
  await chartPage.checkURLIsCorrect(
    `${indicator}&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`
  );
  expect((await axeBuilder.analyze()).violations).toEqual([]);
  await chartPage.checkChartAndChartTable();

  // Act
  await chartPage.clickBackLink();

  // Assert - check indicator selections previously made are prepopulated
  await resultsPage.checkURLIsCorrect(
    `${indicator}&${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`
  );
  await resultsPage.checkSearchResults(indicator);
  await resultsPage.checkIndicatorCheckboxChecked('1');
  await resultsPage.checkIndicatorCheckboxChecked('2');

  // Act
  await resultsPage.clickBackLink();

  // Assert - check search text previously entered is prepopulated
  await homePage.checkURLIsCorrect(
    `?${SearchParams.SearchedIndicator}=${indicator}`
  );
  await homePage.checkSearchFieldIsPrePopulatedWith(indicator);

  // Act - clear the prepopulated search field and click search
  await homePage.clearSearchIndicatorField();
  await homePage.clickSearchButton();

  // Assert - should be on the same page with search field still cleared and validation message displayed
  await homePage.checkURLIsCorrect(
    `?${SearchParams.SearchedIndicator}=ffff${indicator}`
  );
  await homePage.checkSearchFieldIsPrePopulatedWith();
  await homePage.checkSummaryValidation(
    `There is a problemAt least one of the following fields must be populated:Search subjectSearch area`
  );
});
