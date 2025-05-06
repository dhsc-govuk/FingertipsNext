import { AreaDocument } from '@/lib/search/searchTypes';
import { test } from '../../../page-objects/pageFactory';
import { TestTag } from '@/playwright/testHelpers';

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

    test(
      'suggestion panel should return only expected area when there is a full match for area code',
      {
        tag: TestTag.CI,
      },
      async ({ homePage }) => {
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();

        await homePage.checkAreaSuggestionPanelContainsItems(
          testAreaSearchTerm.areaCode,
          [testAreaSearchTerm.areaName]
        );
      }
    );

    test('returns multiple relevant results for a partial postcode', async ({
      homePage,
    }) => {
      await test.step('Navigate to home page', async () => {
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();
      });

      await test.step('Fill in partial postcode and check results', async () => {
        await homePage.checkAreaSuggestionPanelContainsItems(
          testPostcode.substring(0, 6),
          [partialMatchingGp, fullMatchingGp]
        );
      });
    });

    test('returns matching result by postcode for a full postcode search', async ({
      homePage,
    }) => {
      await test.step('Navigate to home page', async () => {
        await homePage.navigateToHomePage();
        await homePage.checkOnHomePage();
      });

      await test.step('Fill in full postcode and check results', async () => {
        await homePage.checkAreaSuggestionPanelContainsItems(testPostcode, [
          fullMatchingGp,
        ]);
      });
    });
  }
);
