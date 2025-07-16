import { InequalitiesTypes } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
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
    subjectSearchTerm: 'Emergency',
    indicatorsToSelect: [
      {
        indicatorID: '41101', // this indicator has unpublished data which should only be returned to the chart page if signed in and has indicator permissions / is an administrator
        knownTrend: 'No recent trend data available',
      },
    ],
    checkExports: true,
    typeOfInequalityToSelect: InequalitiesTypes.Sex,
    signInToCheckUnpublishedData: { administrator: true }, // this journey requires sign in to view the unpublished data
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.TWO_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: "Alzheimer's", // tests with common special character in subject search term
    indicatorsToSelect: [
      {
        indicatorID: '383',
        knownTrend: 'No significant change',
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
    subjectSearchTerm: '91894', // tests searching for a single specific indicatorID
    indicatorsToSelect: [
      {
        indicatorID: '91894',
        knownTrend: 'No significant change',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'counties-and-unitary-authorities',
      groupType: 'combined-authorities',
      group: 'Greater Manchester Combined Authority',
    },
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ALL_AREAS_IN_A_GROUP,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'emergency',
    indicatorsToSelect: [
      {
        indicatorID: '41101', // this indicator has unpublished data which should not be returned to the chart page
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
    subjectSearchTerm: '22401', // tests searching for a single specific indicatorID
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
      group: 'North West Region',
    },
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.THREE_PLUS_AREAS,
    searchMode: SearchMode.ONLY_AREA, // therefore no subject search term or areaFiltersToSelect required
    indicatorsToSelect: [
      {
        indicatorID: '20401',
        knownTrend: 'Decreasing and getting better',
      },
      {
        indicatorID: '241',
        knownTrend: 'Increasing',
      },
    ],
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.ALL_AREAS_IN_A_GROUP,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'people',
    indicatorsToSelect: [
      {
        indicatorID: '383',
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '91894',
        knownTrend: 'No recent trend data available',
      },
    ],
    areaFiltersToSelect: {
      areaType: 'nhs-sub-integrated-care-boards',
      groupType: 'england',
      group: 'england',
    },
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.ENGLAND_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'rate',
    indicatorsToSelect: [
      {
        indicatorID: '93124',
        knownTrend: 'Decreasing and getting better',
      },
      {
        indicatorID: '92266',
        knownTrend: 'Decreasing',
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
    subjectSearchTerm: 'hospital',
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
    subjectSearchTerm: 'hospital',
    indicatorsToSelect: [
      {
        indicatorID: '41101', // this indicator has unpublished data which should not be returned to the chart page
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
    subjectSearchTerm: 'hospital',
    indicatorsToSelect: [
      {
        indicatorID: '41101', // this indicator has unpublished data which should not be returned to the chart page
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
    subjectSearchTerm: 'hospital',
    indicatorsToSelect: [
      {
        indicatorID: '41101', // this indicator has unpublished data which should not be returned to the chart page
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '22401',
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '91894',
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
    indicatorMode: IndicatorMode.THREE_PLUS_INDICATORS,
    areaMode: AreaMode.ENGLAND_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: '93085 22401 90453', // tests searching for multiple specific indicatorIDs including one with unpublished data
    indicatorsToSelect: [
      {
        indicatorID: '93085',
        knownTrend: 'Decreasing and getting better',
      },
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
      },
      {
        indicatorID: '90453', // this indicator has unpublished data which should not be returned to the chart page
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
