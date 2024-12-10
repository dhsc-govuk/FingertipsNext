import { test } from '../page-objects/pageFactory';

test.describe('Line Chart', () => {
  test.beforeEach(async ({ resultsPage }) => {
    // Arrange
    await resultsPage.navigateToHighcharts();
  });

  test('via indicator and assert results', async ({ resultsPage }) => {
    // Assert
    await resultsPage.checkHighChartsURLIsCorrect();

    // Act

    // Assert
  });
});
