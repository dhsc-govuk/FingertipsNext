import { InequalitiesTypes } from '@/components/organisms/Inequalities/inequalitiesHelpers';
import { AreaDocument } from '@/lib/search/searchTypes';
import {
  AreaMode,
  IndicatorMode,
  SearchMode,
  TestParameters,
} from '@/playwright/testHelpers/genericTestUtilities';

// this is for journeys that have a searchMode of either SearchMode.BOTH_SUBJECT_AND_AREA or SearchMode.ONLY_AREA
export const areaSearchTerm: AreaDocument = {
  areaCode: 'E12000002',
  areaType: 'Regions',
  areaName: 'north west region',
};

/**
 * These 15 journeys come from https://ukhsa.atlassian.net/wiki/spaces/FTN/pages/171448117/Area+Indicator+journeys
 * the mapping to which charts should be visible for each journey is defined in scenarioMapper.ts
 */
export const coreTestJourneys: TestParameters[] = [
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ONE_AREA,
    searchMode: SearchMode.BOTH_SUBJECT_AND_AREA, // therefore no subject search term or areaFiltersToSelect required
    subjectSearchTerm: 'smokers',
    indicatorsToSelect: [
      {
        indicatorID: '93085',
        knownTrend: 'Decreasing and getting better',
      },
    ],
    checkExports: true,
    typeOfInequalityToSelect: InequalitiesTypes.Sex,
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.TWO_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'emergency',
    indicatorsToSelect: [
      {
        indicatorID: '41101',
        knownTrend: 'No recent trend data available',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'nhs-regions',
      groupType: 'england',
      group: 'england',
    },
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.THREE_PLUS_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: '91894', // tests searching for a specific indicatorID
    indicatorsToSelect: [
      {
        indicatorID: '91894',
        knownTrend: 'No significant change',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'counties-and-unitary-authorities',
      groupType: 'combined-authorities',
      group: 'Greater Manchester Combined Authority', // if not england then this group is also selected in the benchmarking drop down on the relevant views
    },
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ALL_AREAS_IN_A_GROUP,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'emergency',
    indicatorsToSelect: [
      {
        indicatorID: '41101',
        knownTrend: 'No recent trend data available',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'regions',
      groupType: 'england',
      group: 'england',
    },
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ENGLAND_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: '22401', // tests searching for a specific indicatorID
    indicatorsToSelect: [
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'england',
      groupType: 'england',
      group: 'england',
    },
    typeOfInequalityToSelect: InequalitiesTypes.Deprivation,
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.ONE_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'outcome',
    indicatorsToSelect: [
      {
        indicatorID: '247',
        knownTrend: 'No significant change',
      },
      {
        indicatorID: '241',
        knownTrend: 'Increasing',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'regions',
      groupType: 'england',
      group: 'england',
    },
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.TWO_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'mortality',
    indicatorsToSelect: [
      {
        indicatorID: '93763',
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '93861',
        knownTrend: 'Decreasing and getting better',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'counties-and-unitary-authorities',
      groupType: 'regions',
      group: 'North West Region', // if not england then this group is also selected in the benchmarking drop down on the relevant views
    },
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.THREE_PLUS_AREAS,
    searchMode: SearchMode.ONLY_AREA, // therefore no subject search term or areaFiltersToSelect required
    indicatorsToSelect: [
      {
        indicatorID: '93015',
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '93088',
        knownTrend: 'No recent trend data available',
      },
    ],
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.ALL_AREAS_IN_A_GROUP,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'emergency',
    indicatorsToSelect: [
      {
        indicatorID: '41101',
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '22401',
        knownTrend: 'No recent trend data available', // for all areas in a group, this indicators trend is not available at that geography level
      },
    ],
    areaFiltersToSelect: {
      areaType: 'regions',
      groupType: 'england',
      group: 'england',
    },
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.ENGLAND_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'over',
    indicatorsToSelect: [
      {
        indicatorID: '94035',
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '94063',
        knownTrend: 'No significant change',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'england',
      groupType: 'england',
      group: 'england',
    },
    checkExports: true,
  },
  {
    indicatorMode: IndicatorMode.THREE_PLUS_INDICATORS,
    areaMode: AreaMode.ONE_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'hospital', // a different subject search term is required that returns enough search results allowing for three indicators to be selected
    indicatorsToSelect: [
      {
        indicatorID: '93474',
        knownTrend: 'Decreasing',
      },
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
      },
      {
        indicatorID: '91894',
        knownTrend: 'Decreasing',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'regions',
      groupType: 'england',
      group: 'england',
    },
  },
  {
    indicatorMode: IndicatorMode.THREE_PLUS_INDICATORS,
    areaMode: AreaMode.TWO_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'hospital', // a different subject search term is required that returns enough search results allowing for three indicators to be selected
    indicatorsToSelect: [
      {
        indicatorID: '41101',
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
      },
      {
        indicatorID: '91894',
        knownTrend: 'Decreasing',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'regions',
      groupType: 'england',
      group: 'england',
    },
    checkExports: true,
  },
  {
    indicatorMode: IndicatorMode.THREE_PLUS_INDICATORS,
    areaMode: AreaMode.THREE_PLUS_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'hospital', // a different subject search term is required that returns enough search results allowing for three indicators to be selected
    indicatorsToSelect: [
      {
        indicatorID: '41101',
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
      },
      {
        indicatorID: '91894',
        knownTrend: 'Decreasing',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'regions',
      groupType: 'england',
      group: 'england',
    },
  },
  {
    indicatorMode: IndicatorMode.THREE_PLUS_INDICATORS,
    areaMode: AreaMode.ALL_AREAS_IN_A_GROUP,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'hospital', // a different subject search term is required that returns enough search results allowing for three indicators to be selected
    indicatorsToSelect: [
      {
        indicatorID: '41101',
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
      },
      {
        indicatorID: '91894',
        knownTrend: 'Decreasing',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'regions',
      groupType: 'england',
      group: 'england',
    },
  },
  {
    indicatorMode: IndicatorMode.THREE_PLUS_INDICATORS,
    areaMode: AreaMode.ENGLAND_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'hospital', // a different subject search term is required that returns enough search results allowing for three indicators to be selected
    indicatorsToSelect: [
      {
        indicatorID: '41101',
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
      },
      {
        indicatorID: '91894',
        knownTrend: 'No significant change',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'england',
      groupType: 'england',
      group: 'england',
    },
  },
];
