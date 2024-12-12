import { expect, test } from '../page-objects/pageFactory';

test('Search via indicator and assert results', async ({
  chartPage,
  axeBuilder,
}) => {
  // Arrange
  await chartPage.navigateToChart();

  // Assert
  await chartPage.checkURLIsCorrect();
  expect((await axeBuilder.analyze()).violations).toEqual([]);

  // Act
  await chartPage.checkChart();
});
