import { SearchParams } from '@/lib/searchStateManager';
import { expect, test } from '../page-objects/pageFactory';
import { getIndicatorIDByName } from '../testHelpers';

const searchTerm = 'mortality';
let indicatorID1: string = '';
let indicatorID2: string = '';

test.describe('Search via indicator', () => {
  test.beforeAll(() => {
    indicatorID1 = getIndicatorIDByName(searchTerm)[0].indicatorId;
    indicatorID2 = getIndicatorIDByName(searchTerm)[1].indicatorId;
  });
  test('assert displayed results, check the chart is displayed then navigate back through to search page', async ({
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
    await homePage.typeIndicator(searchTerm);
    await homePage.clickSearchButton();

    // Assert
    await resultsPage.checkURLIsCorrect(searchTerm);
    expect((await axeBuilder.analyze()).violations).toEqual([]);
    await resultsPage.checkSearchResults(searchTerm);

    // Act
    await resultsPage.clickIndicatorCheckbox(indicatorID1);
    await resultsPage.clickIndicatorCheckbox(indicatorID2);
    await resultsPage.clickViewChartsButton();

    // Assert
    await chartPage.checkURLIsCorrect(
      `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorID1}&${SearchParams.IndicatorsSelected}=${indicatorID2}`
    );
    expect((await axeBuilder.analyze()).violations).toEqual([]);
    await chartPage.checkChartAndChartTable();

    // Act
    await chartPage.clickBackLink();

    // Assert - check indicator selections previously made are prepopulated
    await resultsPage.checkURLIsCorrect(
      `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorID1}&${SearchParams.IndicatorsSelected}=${indicatorID2}`
    );
    await resultsPage.checkSearchResults(searchTerm);
    await resultsPage.checkIndicatorCheckboxChecked(indicatorID1);
    await resultsPage.checkIndicatorCheckboxChecked(indicatorID2);

    // Act
    await resultsPage.clickBackLink();

    // Assert - check search text previously entered is prepopulated
    await homePage.checkURLIsCorrect(
      `?${SearchParams.SearchedIndicator}=${searchTerm}`
    );
    await homePage.checkSearchFieldIsPrePopulatedWith(searchTerm);

    // Act - clear the prepopulated search field and click search
    await homePage.clearSearchIndicatorField();
    await homePage.clickSearchButton();

    // Assert - should be on the same page with search field still cleared and validation message displayed
    await homePage.checkURLIsCorrect(
      `?${SearchParams.SearchedIndicator}=${searchTerm}`
    );
    await homePage.checkSearchFieldIsPrePopulatedWith();
    await homePage.checkSummaryValidation(
      `There is a problemAt least one of the following fields must be populated:Search subjectSearch area`
    );
  });
});
