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
