import { SearchParams } from '@/lib/searchStateManager';
import { expect, test } from '../page-objects/pageFactory';

const indicator = '123';

test('Search via indicator and assert displayed results, check the chart is displayed then navigate back through to search page', async ({
  searchPage,
  resultsPage,
  chartPage,
  axeBuilder,
}) => {
  // Arrange
  await searchPage.navigateToSearch();

  // Assert
  await searchPage.checkURLIsCorrect();
  expect((await axeBuilder.analyze()).violations).toEqual([]);

  // Act
  await searchPage.typeIndicator(indicator);
  await searchPage.clickSearchButton();

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
    `${indicator}&${SearchParams.IndicatorsSelected}=${encodeURIComponent('1,2')}`
  );
  expect((await axeBuilder.analyze()).violations).toEqual([]);
  await chartPage.checkChartAndChartTable();

  // Act
  await chartPage.clickBackLink();

  // Assert - check indicator selections previously made are prepopulated
  await resultsPage.checkURLIsCorrect(
    `${indicator}&${SearchParams.IndicatorsSelected}=${encodeURIComponent('1,2')}`
  );
  await resultsPage.checkSearchResults(indicator);
  await resultsPage.checkIndicatorCheckboxChecked('1');
  await resultsPage.checkIndicatorCheckboxChecked('2');

  // Act
  await resultsPage.clickBackLink();

  // Assert - check search text previously entered is prepopulated
  await searchPage.checkURLIsCorrect(
    `?${SearchParams.SearchedIndicator}=${indicator}`
  );
  await searchPage.checkSearchFieldIsPrePopulatedWith(indicator);

  // Act - clear the prepopulated search field and click search
  await searchPage.clearSearchIndicatorField();
  await searchPage.clickSearchButton();

  // Assert - should be on the same page with search field still cleared and validation message displayed
  await searchPage.checkURLIsCorrect(
    `?${SearchParams.SearchedIndicator}=${indicator}`
  );
  await searchPage.checkSearchFieldIsPrePopulatedWith();
  await searchPage.checkSummaryValidation(
    `There is a problemAt least one of the following fields must be populated:Indicator field`
  );
});
