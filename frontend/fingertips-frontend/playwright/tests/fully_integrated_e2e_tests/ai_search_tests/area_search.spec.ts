import { AreaDocument } from '@/lib/search/searchTypes';
import { test } from '../../../page-objects/pageFactory';
import { TestTag } from '@/playwright/testHelpers/genericTestUtilities';

test.describe(
  'Azure AI Search: Area search suggestions',
  {
    tag: TestTag.CD,
  },
  () => {
    const testPostcode = 'LE12 8PY';
    const fullMatchingGp = 'Barrow Health Centre';
    const partialMatchingGp = 'Quorn Medical Centre';
    const testAreaSearchTerm: AreaDocument = {
      areaCode: 'E12000002',
      areaType: 'Regions',
      areaName: 'North West Region',
    };

    test.beforeEach(async ({ homePage }) => {
      await test.step('Navigate to home page', async () => {
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();
      });
    });

    test(
      'suggestion panel should return only expected area when there is a full match for area code',
      {
        tag: TestTag.CD,
      },
      async ({ homePage }) => {
        await test.step('Fill in full area code and check results', async () => {
          await homePage.searchForArea(testAreaSearchTerm.areaCode);
          await homePage.checkAreaSuggestionPanelContainsAreas([
            testAreaSearchTerm.areaName,
          ]);
        });
      }
    );

    test('returns multiple relevant results for a partial postcode', async ({
      homePage,
    }) => {
      await test.step('Fill in partial postcode and check results', async () => {
        await homePage.searchForArea(testPostcode.substring(0, 6));
        await homePage.checkAreaSuggestionPanelContainsAreas([
          fullMatchingGp,
          partialMatchingGp,
        ]);
      });
    });

    test('returns matching result by postcode for a full postcode search', async ({
      homePage,
    }) => {
      await test.step('Fill in full postcode and check results', async () => {
        await homePage.searchForArea(testPostcode);
        await homePage.checkAreaSuggestionPanelContainsAreas([fullMatchingGp]);
      });
    });
  }
);
