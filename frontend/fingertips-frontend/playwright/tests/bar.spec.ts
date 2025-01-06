import { expect, test } from '../page-objects/pageFactory';

test('View a bar chart', async ({ barPage, axeBuilder }) => {
  // Arrange
  await barPage.navigateToChart();

  // Assert
  await barPage.checkURLIsCorrect();
  expect((await axeBuilder.analyze()).violations).toEqual([]);

  // Act
  await barPage.checkChart();
});
