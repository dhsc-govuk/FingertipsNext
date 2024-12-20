import { expect, test } from '../page-objects/pageFactory';

const indicator = '123';

test('Search via indicator and assert results', async ({
  searchPage,
  resultsPage,
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
});

test('Should return to search page upon results page back link click', async ({
  searchPage,
  resultsPage,
}) => {
  // Arrange
  await searchPage.navigateToSearch();

  // Assert
  await searchPage.checkURLIsCorrect();

  // Act
  await searchPage.typeIndicator(indicator);
  await searchPage.clickSearchButton();

  // Assert
  await resultsPage.checkURLIsCorrect(indicator);
  await resultsPage.checkSearchResults(indicator);

  // Act
  await resultsPage.clickBackLink();

  // Assert
  await searchPage.checkURLIsCorrect(`?indicator=${indicator}`);
});

test('Should navigate to chart page', async ({
  searchPage,
  resultsPage,
  chartPage,
}) => {
  await searchPage.navigateToSearch();
  await searchPage.checkURLIsCorrect();

  await searchPage.typeIndicator(indicator);
  await searchPage.clickSearchButton();

  await resultsPage.checkURLIsCorrect(indicator);
  await resultsPage.checkSearchResults(indicator);
  await resultsPage.clickIndicatorCheckbox('1');
  await resultsPage.clickIndicatorCheckbox('2');
  await resultsPage.clickViewChartsButton();

  // Assert
  await chartPage.checkURLIsCorrect(
    `?indicatorsSelected=${encodeURIComponent('1,2')}`
  );
});
