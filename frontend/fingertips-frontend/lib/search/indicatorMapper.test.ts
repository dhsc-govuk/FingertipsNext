import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { IndicatorMapper } from './indicatorMapper';

describe('indicatorMapper tests', () => {
  describe('toEntities method tests', () => {
    // Indicator Mapper does not store state, so single instance can be used by all tests
    const indicatorMapper = new IndicatorMapper();

    it('maps multiple raw indicators to entities successfully', () => {
      const mockRawIndicators = [
        {
          indicatorID: '1',
          indicatorName: 'Red faced',
          indicatorDefinition:
            'Count of people who did something they are embarrassed by',
          earliestDataPeriod: '1938',
          latestDataPeriod: '2023',
          dataSource: 'The Beano',
          lastUpdatedDate: new Date('December 6, 2024'),
          associatedAreaCodes: ['Area1'],
          trendsByArea: [
            {
              areaCode: 'Area1',
              trend: HealthDataPointTrendEnum.IncreasingAndGettingWorse,
            },
          ],
          unitLabel: '',
          hasInequalities: false,
          usedInPoc: true,
        },
        {
          indicatorID: '2',
          indicatorName: 'Perp count',
          indicatorDefinition: 'Perps brought to justice by Red Angel',
          earliestDataPeriod: '1977',
          latestDataPeriod: '2022',
          dataSource: 'Mega City 1',
          lastUpdatedDate: new Date('November 5, 2023'),
          associatedAreaCodes: ['Area1', 'Area2'],
          trendsByArea: [
            {
              areaCode: 'Area1',
              trend: HealthDataPointTrendEnum.Decreasing,
            },
            {
              areaCode: 'Area2',
              trend: HealthDataPointTrendEnum.NoSignificantChange,
            },
          ],
          unitLabel: '',
          hasInequalities: true,
          usedInPoc: true,
        },
      ];

      const result = indicatorMapper.toEntities(mockRawIndicators, ['Area1'], true);

      expect(result).toEqual([
        {
          indicatorID: '1',
          indicatorName: 'Red faced',
          indicatorDefinition:
            'Count of people who did something they are embarrassed by',
          earliestDataPeriod: '1938',
          latestDataPeriod: '2023',
          dataSource: 'The Beano',
          lastUpdatedDate: new Date('December 6, 2024'),
          trend: 'Increasing and getting worse',
          unitLabel: '',
          hasInequalities: false,
        },
        {
          indicatorID: '2',
          indicatorName: 'Perp count',
          indicatorDefinition: 'Perps brought to justice by Red Angel',
          earliestDataPeriod: '1977',
          latestDataPeriod: '2022',
          dataSource: 'Mega City 1',
          lastUpdatedDate: new Date('November 5, 2023'),
          trend: 'Decreasing',
          unitLabel: '',
          hasInequalities: true,
        },
      ]);
    });

    it('maps trend to undefined when a user has requested more an indicator in more than one area', () => {
      const mockRawIndicators = [
        {
          indicatorID: '1',
          indicatorName: 'Red faced',
          indicatorDefinition:
            'Count of people who did something they are embarrassed by',
          earliestDataPeriod: '1938',
          latestDataPeriod: '2023',
          dataSource: 'The Beano',
          lastUpdatedDate: new Date('December 6, 2024'),
          associatedAreaCodes: ['Area1', 'Area2'],
          trendsByArea: [
            {
              areaCode: 'Area1',
              trend: HealthDataPointTrendEnum.IncreasingAndGettingWorse,
            },
            {
              areaCode: 'Area2',
              trend: HealthDataPointTrendEnum.NoSignificantChange,
            },
          ],
          unitLabel: '',
          hasInequalities: false,
          usedInPoc: true,
        },
      ];

      const result = indicatorMapper.toEntities(mockRawIndicators, [
        'Area1',
        'Area2',
      ], true);

      expect(result).toEqual([
        {
          indicatorID: '1',
          indicatorName: 'Red faced',
          indicatorDefinition:
            'Count of people who did something they are embarrassed by',
          earliestDataPeriod: '1938',
          latestDataPeriod: '2023',
          dataSource: 'The Beano',
          lastUpdatedDate: new Date('December 6, 2024'),
          trend: undefined,
          unitLabel: '',
          hasInequalities: false,
        },
      ]);
    });

    // Edge case that could occur due to data issues. If an indicator does appear in an area but a trend was not calculated
    // for that particular area, fall back to undefined so the UI will render appropriately
    it('maps trend to undefined when no trend can be found for the area code', () => {
      const mockRawIndicators = [
        {
          indicatorID: '1',
          indicatorName: 'Red faced',
          indicatorDefinition:
            'Count of people who did something they are embarrassed by',
          earliestDataPeriod: '1938',
          latestDataPeriod: '2023',
          dataSource: 'The Beano',
          lastUpdatedDate: new Date('December 6, 2024'),
          associatedAreaCodes: ['Area1', 'Area2'],
          trendsByArea: [
            {
              areaCode: 'Area1',
              trend: HealthDataPointTrendEnum.IncreasingAndGettingWorse,
            },
          ],
          unitLabel: '',
          hasInequalities: false,
          usedInPoc: true,
        },
      ];

      const result = indicatorMapper.toEntities(mockRawIndicators, ['Area2'], false);

      expect(result).toEqual([
        {
          indicatorID: '1',
          indicatorName: 'Red faced',
          indicatorDefinition:
            'Count of people who did something they are embarrassed by',
          earliestDataPeriod: '1938',
          latestDataPeriod: '2023',
          dataSource: 'The Beano',
          lastUpdatedDate: new Date('December 6, 2024'),
          trend: undefined,
          unitLabel: '',
          hasInequalities: false,
        },
      ]);
    });

    // DHSCFT-198 - AC1 - if no area specified but England chosen as group, then return the trend for England
    it('retrieves the trend for England when no area has been specificed but England chosen as group', () => {
      const mockRawIndicators = [
        {
          indicatorID: '1',
          indicatorName: 'Red faced',
          indicatorDefinition:
            'Count of people who did something they are embarrassed by',
          earliestDataPeriod: '1938',
          latestDataPeriod: '2023',
          dataSource: 'The Beano',
          lastUpdatedDate: new Date('December 6, 2024'),
          associatedAreaCodes: ['Area1', 'Area2', 'E92000001'],
          trendsByArea: [
            {
              areaCode: 'Area1',
              trend: HealthDataPointTrendEnum.IncreasingAndGettingWorse,
            },
            {
              areaCode: 'Area2',
              trend: HealthDataPointTrendEnum.NoSignificantChange,
            },
            {
              areaCode: 'E92000001',
              trend: HealthDataPointTrendEnum.DecreasingAndGettingBetter,
            },
          ],
          unitLabel: '',
          hasInequalities: false,
          usedInPoc: true,
        },
      ];

      const result = indicatorMapper.toEntities(mockRawIndicators, [], true);

      expect(result).toEqual([
        {
          indicatorID: '1',
          indicatorName: 'Red faced',
          indicatorDefinition:
            'Count of people who did something they are embarrassed by',
          earliestDataPeriod: '1938',
          latestDataPeriod: '2023',
          dataSource: 'The Beano',
          lastUpdatedDate: new Date('December 6, 2024'),
          trend: 'Decreasing and getting better',
          unitLabel: '',
          hasInequalities: false,
        },
      ]);
    });
  });
});
