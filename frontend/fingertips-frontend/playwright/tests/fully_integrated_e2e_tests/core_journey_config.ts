import { InequalitiesTypes } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { ReportingPeriod } from '@/generated-sources/ft-api-client/models/ReportingPeriod';
import { AreaDocument } from '@/lib/search/searchTypes';
import {
  AreaMode,
  IndicatorMode,
  SearchMode,
  SignInAs,
  TestParameters,
} from '@/playwright/testHelpers/genericTestUtilities';
import { PeriodType } from '@/generated-sources/ft-api-client/models';

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
        unpublishedDataYear: 2024,
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
        segmentationData: [
          {
            sex: 'Male',
            age: 'All ages',
            reportingPeriod: ReportingPeriod.Yearly,
          },
          {
            sex: 'Female',
            age: 'All ages',
            reportingPeriod: ReportingPeriod.Yearly,
          },
          {
            sex: 'Persons',
            age: 'All ages',
            reportingPeriod: ReportingPeriod.Yearly,
          },
        ],
      },
    ],
    checkExports: true,
    typeOfInequalityToSelect: InequalitiesTypes.Sex,
    signInAsUserToCheckUnpublishedData: SignInAs.administrator, // this journey will check we show the unpublished data as we are signed in as an administrator
  },
  {
    indicatorMode: IndicatorMode.ONE_INDICATOR,
    areaMode: AreaMode.TWO_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'alcohol-specific', // tests with common special character in subject search term
    indicatorsToSelect: [
      {
        indicatorID: '92904',
        knownTrend: 'No significant change',
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2023-01-01'),
          to: new Date('2023-12-31'),
        },
        segmentationData: [
          {
            sex: 'Male',
            age: '<18 yrs',
            reportingPeriod: ReportingPeriod.ThreeYearly,
          },
          {
            sex: 'Female',
            age: '<18 yrs',
            reportingPeriod: ReportingPeriod.ThreeYearly,
          },
          {
            sex: 'Persons',
            age: '<18 yrs',
            reportingPeriod: ReportingPeriod.ThreeYearly,
          },
        ],
      },
    ],
    areaFiltersToSelect: {
      areaType: 'districts-and-unitary-authorities',
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
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
        segmentationData: [
          {
            sex: 'Persons',
            age: '65+ yrs',
            reportingPeriod: ReportingPeriod.Yearly,
          },
        ],
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
    subjectSearchTerm: 'smokers',
    indicatorsToSelect: [
      {
        indicatorID: '90453', // this indicator has unpublished data which should only be returned to the chart page if signed in and has indicator permissions / is an administrator
        knownTrend: 'No recent trend data available', // 2023 has the trend 'No significant change' but 2024 has no trend data
        unpublishedDataYear: 2025,
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
        segmentationData: [
          {
            sex: 'Persons',
            age: '16+ yrs',
            reportingPeriod: ReportingPeriod.Yearly,
          },
        ],
      },
    ],
    areaFiltersToSelect: {
      areaType: 'nhs-regions',
      groupType: 'england',
      group: 'england',
    },
    signInAsUserToCheckUnpublishedData: SignInAs.userWithIndicatorPermissions, // this journey will check we show the unpublished data as we are signed in as a user with indicator permissions
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
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
        segmentationData: [
          {
            sex: 'Male',
            age: '65+ yrs',
            reportingPeriod: ReportingPeriod.Yearly,
          },
          {
            sex: 'Female',
            age: '65+ yrs',
            reportingPeriod: ReportingPeriod.Yearly,
          },
          {
            sex: 'Persons',
            age: '65+ yrs',
            reportingPeriod: ReportingPeriod.Yearly,
          },
        ],
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
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
      },
      {
        indicatorID: '241',
        knownTrend: 'Increasing',
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
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
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
      },
      {
        indicatorID: '93861',
        knownTrend: 'Decreasing and getting better',
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
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
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
      },
      {
        indicatorID: '241',
        knownTrend: 'Increasing',
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
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
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
      },
      {
        indicatorID: '91894',
        knownTrend: 'No recent trend data available',
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
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
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
      },
      {
        indicatorID: '92266',
        knownTrend: 'Decreasing',
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
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
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
      },
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
      },
      {
        indicatorID: '91894',
        knownTrend: 'Decreasing',
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
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
        indicatorID: '41101', // this indicator has unpublished data which should only be returned to the chart page if signed in and has indicator permissions / is an administrator
        knownTrend: 'No recent trend data available',
        unpublishedDataYear: 2024,
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
      },
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
      },
      {
        indicatorID: '91894',
        knownTrend: 'Decreasing',
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
      },
    ],
    areaFiltersToSelect: {
      areaType: 'regions',
      groupType: 'england',
      group: 'england',
    },
    checkExports: true,
    signInAsUserToCheckUnpublishedData:
      SignInAs.userWithoutIndicatorPermissions, // this journey will check we do not show the unpublished data as we are signed in as a user without indicator permissions
  },
  {
    indicatorMode: IndicatorMode.THREE_PLUS_INDICATORS,
    areaMode: AreaMode.THREE_PLUS_AREAS,
    searchMode: SearchMode.ONLY_SUBJECT,
    subjectSearchTerm: 'hospital',
    indicatorsToSelect: [
      {
        indicatorID: '41101', // this indicator has unpublished data which should only be returned to the chart page if signed in and has indicator permissions / is an administrator
        knownTrend: 'No recent trend data available',
        unpublishedDataYear: 2024, // this journey will check we do not show this unpublished data year as we we do not sign in at the start (no signInAsUserToCheckUnpublishedData attribute)
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
      },
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
      },
      {
        indicatorID: '91894',
        knownTrend: 'Decreasing',
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
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
        indicatorID: '41101', // this indicator has unpublished data which should only be returned to the chart page if signed in and has indicator permissions / is an administrator
        knownTrend: 'No recent trend data available',
        unpublishedDataYear: 2024,
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
      },
      {
        indicatorID: '22401',
        knownTrend: 'No recent trend data available',
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
      },
      {
        indicatorID: '91894',
        knownTrend: 'No recent trend data available',
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
      },
    ],
    areaFiltersToSelect: {
      areaType: 'regions',
      groupType: 'england',
      group: 'england',
    },
    signInAsUserToCheckUnpublishedData: SignInAs.administrator, // this journey will check we show the unpublished data as we are signed in as an administrator
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
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
      },
      {
        indicatorID: '22401',
        knownTrend: 'Decreasing and getting better',
        timePeriodData: {
          type: PeriodType.Financial,
          from: new Date('2022-01-01'),
          to: new Date('2022-12-31'),
        },
      },
      {
        indicatorID: '90453', // this indicator has unpublished data which should only be returned to the chart page if signed in and has indicator permissions / is an administrator
        knownTrend: 'No recent trend data available', // 2024 has the trend 'No significant change' but 2025 has no trend data so shows as 'No recent trend data available'
        unpublishedDataYear: 2025,
        timePeriodData: {
          type: PeriodType.Calendar,
          from: new Date('2024-01-01'),
          to: new Date('2024-12-31'),
        },
      },
    ],
    areaFiltersToSelect: {
      areaType: 'england',
      groupType: 'england',
      group: 'england',
    },
    signInAsUserToCheckUnpublishedData: SignInAs.userWithIndicatorPermissions, // this journey will check we show the unpublished data as we are signed in as a user with indicator permissions
  },
];
