import { expect, test } from '../page-objects/pageFactory';

const indicator = '123';

test('Search via indicator assert results and chart displayed then navigate back', async ({
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
    `?indicator=${indicator}&indicatorsSelected=${encodeURIComponent('1,2')}`
  );
  expect((await axeBuilder.analyze()).violations).toEqual([]);
  await chartPage.checkChartAndChartTable();

  // Act
  await chartPage.clickBackLink();

  // Assert
  await resultsPage.checkSearchResults(indicator);
  await resultsPage.checkIndicatorCheckboxChecked('1');
  await resultsPage.checkIndicatorCheckboxChecked('2');

  // Act
  await resultsPage.clickBackLink();

  // Assert
  await searchPage.checkURLIsCorrect(`?indicator=${indicator}`);
});
