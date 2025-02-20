// test.skip('check available area types when no areas are selected when coming onto the results pages', async ({
//     homePage,
//     resultsPage,
//   }) => {
//     await test.step('Search for a test indicator', async () => {
//       await homePage.navigateToHomePage();
//       await homePage.checkOnHomePage();
//       await homePage.typeIndicator(searchTerm);
//       await homePage.clickSearchButton();
//       await resultsPage.waitForURLToContain(searchTerm);
//     });

//     await test.step('Check available area types', async () => {
//       const expectedOptions = [
//         'England',
//         'NHS Regions',
//         'Regions',
//         'Combined Authorities',
//         'NHS Integrated Care Boards',
//         'Counties and Unitary Authorities',
//         'NHS Sub Integrated Care Boards',
//         'Districts and Unitary Authorities',
//         'NHS Primary Care Networks',
//         'GPs',
//       ];
//       const options = await resultsPage.areaFilterOptionsText();
//       test.expect(options).toHaveLength(expectedOptions.length);
//       test
//         .expect(sortAlphabetically(options))
//         .toEqual(sortAlphabetically(expectedOptions));
//     });
//   });

//   const sortAlphabetically = (array: (string | null)[]) =>
//     array.sort((a, b) => a!.localeCompare(b!));
// });

//       await test.step('Validate indicator search on results page', async () => {
//         await resultsPage.clearIndicatorSearchBox();
//         await resultsPage.clickIndicatorSearchButton();
//         await resultsPage.checkForIndicatorSearchError();

//         await expectNoAccessibilityViolations(axeBuilder);

//         await resultsPage.fillIndicatorSearch(searchTerm);
//         await resultsPage.clickIndicatorSearchButtonAndWait(searchTerm);
//         await resultsPage.checkSearchResults(searchTerm);
//       });

// await test.step('Return to results page and verify selections are preselected', async () => {
//   await chartPage.clickBackLink();

//   await resultsPage.waitForURLToContain(
//     `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorIDs[0]}&${SearchParams.IndicatorsSelected}=${indicatorIDs[1]}`
//   );
//   await resultsPage.checkSearchResults(searchTerm);
//   await resultsPage.checkIndicatorCheckboxChecked(indicatorIDs[0]);
//   await resultsPage.checkIndicatorCheckboxChecked(indicatorIDs[1]);
// });

// await test.step('Return to search page and verify fields are correctly prepopulated', async () => {
//   await resultsPage.clickBackLink();

//   await homePage.waitForURLToContain(
//     `${SearchParams.SearchedIndicator}=${searchTerm}`
//   );
//   await homePage.checkSearchFieldIsPrePopulatedWith(searchTerm);
// });

// await test.step('Select single indicator and view charts', async () => {
//   await homePage.clearSearchIndicatorField();
//   await homePage.typeIndicator(searchTerm);
//   await homePage.clickSearchButton();

//   await resultsPage.waitForURLToContain(
//     `${SearchParams.SearchedIndicator}=${searchTerm}`
//   );

//   await resultsPage.selectIndicatorCheckboxes([indicatorIDs[0]]);
//   await resultsPage.waitForURLToContain(
//     `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorIDs[0]}`
//   );

//   await resultsPage.clickViewChartsButton();
//   await chartPage.waitForURLToContain(
//     `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorIDs[0]}`
//   );
//   await expectNoAccessibilityViolations(axeBuilder);
//   await chartPage.checkChartVisibility(
//     IndicatorMode.ONE_INDICATOR,
//     AreaMode.ENGLAND_AREA
//   );

//   await chartPage.clickBackLink();
//   await resultsPage.waitForURLToContain(
//     `${searchTerm}&${SearchParams.IndicatorsSelected}=${indicatorIDs[0]}`
//   );

//   await resultsPage.clickBackLink();

//   await homePage.checkOnHomePage();
// });

// await test.step('Verify search page validation prevents forward navigation', async () => {
//   await homePage.clearSearchIndicatorField();
//   await homePage.clickSearchButton();

//   await homePage.waitForURLToContain(
//     `${SearchParams.SearchedIndicator}=${searchTerm}`
//   );
//   await homePage.checkSearchFieldIsPrePopulatedWith();
//   await homePage.checkSummaryValidation(
//     `There is a problemAt least one of the following fields must be populated:Search subjectSearch area`
//   );
// });

// test('check area type pills on results page when areas specified in url', async ({
//     resultsPage,
//   }) => {
//     await test.step('Search for a test indicator', async () => {
//       await resultsPage.navigateToResults('smoking', [
//         'E40000012',
//         'E40000011',
//         'E40000010',
//       ]);
//     });

//     await test.step('Check selected area pills matches those specified in url', async () => {
//       const expectdPillTexts = [
//         'North East and Yorkshire NHS Region',
//         'Midlands NHS Region',
//         'North West NHS Region',
//       ];
//       await test
//         .expect(resultsPage.areaFilterPills())
//         .toHaveCount(expectdPillTexts.length);

//       const filterPillNames = await resultsPage.areaFilterPillsText();
//       test
//         .expect(sortAlphabetically(filterPillNames))
//         .toEqual(sortAlphabetically(expectdPillTexts));

//       await test.expect(resultsPage.areaFilterCombobox()).toBeDisabled();
//     });

//     await test.step('Click remove one area pill and re-check area pills', async () => {
//       await resultsPage.closeAreaFilterPill(1);

//       const expectdPillTexts = [
//         'North East and Yorkshire NHS Region',
//         'North West NHS Region',
//       ];
//       await test
//         .expect(resultsPage.areaFilterPills())
//         .toHaveCount(expectdPillTexts.length);

//       const filterPillNames = await resultsPage.areaFilterPillsText();
//       test
//         .expect(sortAlphabetically(filterPillNames))
//         .toEqual(sortAlphabetically(expectdPillTexts));

//       await test.expect(resultsPage.areaFilterCombobox()).toBeDisabled();
//     });

//     await test.step('Check url has been updated after area pill removal', async () => {
//       await test.expect(resultsPage.page).toHaveURL(/&as=E40000012/);
//       await test.expect(resultsPage.page).not.toHaveURL(/&as=E40000011/);
//       await test.expect(resultsPage.page).toHaveURL(/&as=E40000010/);
//     });

//     await test.step('Remove all pills and check url and area type combobox', async () => {
//       await resultsPage.closeAreaFilterPill(0);
//       await test.expect(resultsPage.page).not.toHaveURL(/&as=E40000012/);

//       await resultsPage.closeAreaFilterPill(0);
//       await test.expect(resultsPage.page).not.toHaveURL(/&as=/);

//       await test.expect(resultsPage.areaFilterCombobox()).toBeEnabled();
//     });
//   });
