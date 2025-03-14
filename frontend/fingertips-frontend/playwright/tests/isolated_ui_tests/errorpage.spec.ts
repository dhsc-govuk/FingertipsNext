import { test } from '../../page-objects/pageFactory';
import {
    getAllIndicatorIdsForSearchTerm,
    getAllNHSRegionAreas,
    IndicatorMode,
    returnIndicatorIDsByIndicatorMode,
    SearchMode,
    sortAlphabetically,
} from '../../testHelpers';
import mockIndicators from '../../../assets/mockIndicatorData.json';
import mockAreas from '../../../assets/mockAreaData.json';
import { AreaDocument, IndicatorDocument } from '@/lib/search/searchTypes';
import { englandArea } from '@/mock/data/areas/englandAreas';
import { server } from '@/mock/server/node';
import { http, HttpResponse } from 'msw';

// tests in this file use mock service worker to mock the API response
// so that the tests can be run without the need for a backend
// see frontend/fingertips-frontend/assets/mockIndicatorData.json
// and frontend/fingertips-frontend/assets/mockAreaData.json
const subjectSearchTerm = 'hospital';

const baseURL = process.env.FINGERTIPS_API_URL;

test.beforeAll(
    `get indicatorIDs from the mock data source for searchTerm: ${subjectSearchTerm} and get mock area data`,
    () => {

    }
);

test.describe('Error page tests', () => {
    test('HomePage displays ErrorPage when API unavailable', async ({
                                                                        homePage,
                                                                    }) => {
        const a = server.listHandlers().length;

        server.use(
            http.get(`${baseURL}/areas/*`, async () => {
                return new HttpResponse('Test API error 500', { status: 500 });
            })
        );

        const b = server.listHandlers().length;

        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();
        await homePage.searchForIndicators(
            SearchMode.BOTH_SUBJECT_AND_AREA,
            'hospital',
            'north west region'
        );
        await homePage.clickSearchButton();

        await test
            .expect(homePage.errorPageTitle())
            .toContainText('Sorry, there is a problem with the service');
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
