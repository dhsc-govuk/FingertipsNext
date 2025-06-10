import { AreaDocument } from '@/lib/search/searchTypes';
import {
  AreaMode,
  IndicatorMode,
  SearchMode,
  TestParams,
} from '@/playwright/testHelpers';

// this is for core journeys defined in core_journey_config.ts that are a searchMode of either SearchMode.BOTH_SUBJECT_AND_AREA or SearchMode.ONLY_AREA
export const areaSearchTerm: AreaDocument = {
  areaCode: 'E12000002',
  areaType: 'Regions',
  areaName: 'north west region',
};

export const coreTestJourneys: TestParams[] = [
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
    checkExports: true,
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.ONE_AREA,
    searchMode: SearchMode.BOTH_SUBJECT_AND_AREA, // therefore no subject search term or areaFiltersToSelect required
    subjectSearchTerm: 'emergency',
    indicatorsToSelect: [
      {
        indicatorID: '41101',
        knownTrend: 'No recent trend data available',
      },
    ],
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
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.ENGLAND_AREA,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'emergency',
    indicatorsToSelect: [
      {
        indicatorID: '41101',
        knownTrend: 'No recent trend data available',
      },
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
  },
  {
    indicatorMode: IndicatorMode.TWO_INDICATORS,
    areaMode: AreaMode.TWO_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'emergency',
    indicatorsToSelect: [
      {
        indicatorID: '41101',
        knownTrend: 'No recent trend data available',
      },

      {
        indicatorID: '22401',
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
        indicatorID: '41101',
        knownTrend: 'No recent trend data available',
      },
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
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
    indicatorMode: IndicatorMode.THREE_PLUS_INDICATORS,
    areaMode: AreaMode.ONE_AREA,
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
  },
];
