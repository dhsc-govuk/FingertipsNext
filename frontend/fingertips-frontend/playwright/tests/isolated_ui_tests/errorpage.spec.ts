import { test } from '../../page-objects/pageFactory';
import { server } from '@/mock/server/node';
const subjectSearchTerm = 'hospital';

test.beforeAll(
  `get indicatorIDs from the mock data source for searchTerm: ${subjectSearchTerm} and get mock area data`,
  () => {}
);

test.describe('Error page tests', () => {
  test('Home page displays ErrorPage when API returns unexpected error', async ({
    homePage,
  }) => {
    await homePage.navigateToHomePage('?as=ERRORY07275');

    await test
      .expect(homePage.errorPageTitle())
      .toContainText('Sorry, there is a problem with the service');
  });

  test('Chart page displays ErrorPage when API returns unexpected error', async ({
    chartPage,
  }) => {
    await chartPage.page.goto('/chart?is=ERROR90453');

    await test
      .expect(chartPage.errorPageTitle())
      .toContainText('Sorry, there is a problem with the service');
  });

  test('Indicator page displays ErrorPage when API returns unexpected error', async ({
    indicatorPage,
  }) => {
    await indicatorPage.navigateToIndicatorPage('ERROR90453');

    await test
      .expect(indicatorPage.errorPageTitle())
      .toContainText('Sorry, there is a problem with the service');
  });

  test('Results page displays ErrorPage when API returns unexpected error', async ({
    resultsPage,
  }) => {
    await resultsPage.navigateToResults('ERROR90453', ['ERRORY07275']);

    await test
      .expect(resultsPage.errorPageTitle())
      .toContainText('Sorry, there is a problem with the service');
  });

  test('Navigating to an unsupported url should show the not found page', async ({
    homePage,
  }) => {
    await homePage.page.goto('cabbage');

    await test
      .expect(homePage.errorPageTitle())
      .toContainText('Page not found');
  });
});

// log out current url when a test fails
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    // Test failed - capture the URL
    const url = page.url();
    console.log(`Test failed! Current URL: ${url}`);

    // You can also attach it to the test report
    await testInfo.attach('failed-url', {
      body: url,
      contentType: 'text/plain',
    });
  }

  server.resetHandlers();
});
