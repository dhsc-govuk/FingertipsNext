import { test } from '../../page-objects/pageFactory';
import { ErrorAreaCode, ErrorIndicatorId } from '@/mock/ErrorTriggeringIds';

const errorChartPageURL = `/chart?si=Alzheimer&is=${ErrorIndicatorId}&ats=england&gts=england&gs=${ErrorAreaCode}`;

// we are intentionally setting failOnUnhandledError to false as we are testing error handling in this file
test.use({ failOnUnhandledError: false });

test.describe('Error page tests', () => {
  test('Home page displays ErrorPage when API returns unexpected error', async ({
    homePage,
    axeBuilder,
  }) => {
    await homePage.navigateToHomePage(`?as=${ErrorAreaCode}`);

    await test
      .expect(homePage.errorPageTitle())
      .toContainText('Sorry, there is a problem with the service');
    await homePage.expectNoAccessibilityViolations(axeBuilder);
  });

  test('Chart page displays ErrorPage when API returns unexpected error', async ({
    chartPage,
    axeBuilder,
  }) => {
    await chartPage.page.goto(errorChartPageURL);

    await test
      .expect(chartPage.errorPageTitle())
      .toContainText('Sorry, there is a problem with the service');
    await chartPage.expectNoAccessibilityViolations(axeBuilder);
  });

  test('Indicator page displays ErrorPage when API returns unexpected error', async ({
    indicatorPage,
  }) => {
    await indicatorPage.navigateToIndicatorPage(`${ErrorIndicatorId}`);

    await test
      .expect(indicatorPage.errorPageTitle())
      .toContainText('Sorry, there is a problem with the service');
  });

  test('Results page displays ErrorPage when API returns unexpected error', async ({
    resultsPage,
    axeBuilder,
  }) => {
    await resultsPage.navigateToResults(`${ErrorIndicatorId}`, [
      `${ErrorAreaCode}`,
    ]);

    await test
      .expect(resultsPage.errorPageTitle())
      .toContainText('Sorry, there is a problem with the service');
    await resultsPage.expectNoAccessibilityViolations(axeBuilder);
  });

  test('Navigating to an unsupported url should show the not found page', async ({
    homePage,
    axeBuilder,
  }) => {
    await homePage.page.goto('cabbage');

    await test
      .expect(homePage.errorPageTitle())
      .toContainText('Page not found');
    await homePage.expectNoAccessibilityViolations(axeBuilder);
  });
});
