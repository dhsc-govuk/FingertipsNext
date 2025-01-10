import { expect, test } from '../page-objects/pageFactory';

test('View a line chart and table', async ({ chartPage, axeBuilder }) => {
  // Arrange
  await chartPage.navigateToChart();

  // Assert
  await chartPage.checkURLIsCorrect();
  expect((await axeBuilder.analyze()).violations).toEqual([]);

  // Act
  await chartPage.checkChartAndChartTable();
});
