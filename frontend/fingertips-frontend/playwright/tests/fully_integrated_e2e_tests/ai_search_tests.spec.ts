import { test } from '../../page-objects/pageFactory';
import { AreaDocument } from '@/lib/search/searchTypes';

const areaSearchTerm: AreaDocument = {
  areaCode: 'E12000002',
  areaType: 'Regions',
  areaName: 'North West Region',
};

test.describe('Area search suggestions', () => {
  test('suggestion panel should return only expected area when there is a full match for area code', async ({
    homePage,
  }) => {
    await homePage.navigateToHomePage();
    await homePage.checkOnHomePage();

    await homePage.checkAreaSuggestionPanelContainsItems(
      areaSearchTerm.areaCode,
      1,
      [areaSearchTerm.areaName]
    );
  });
});
