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
