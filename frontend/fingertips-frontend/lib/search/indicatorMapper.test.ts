import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client';
import { IndicatorMapper } from './indicatorMapper';
import {
  generateIndicatorDocument,
  generateRawIndicatorDocument,
} from './mockDataHelper';
import { RawIndicatorDocument } from './searchTypes';

describe('indicatorMapper tests', () => {
  describe('toEntities method tests', () => {
    // Indicator Mapper does not store state, so single instance can be used by all tests
    const indicatorMapper = new IndicatorMapper();
    const baseMockRawIndicators: RawIndicatorDocument[] = [
      generateRawIndicatorDocument('1'),
      generateRawIndicatorDocument('2'),
    ];
    const baseExpectedMappedIndicators = [
      generateIndicatorDocument('1'),
      generateIndicatorDocument('2'),
    ];

    it('maps multiple raw indicators to entities successfully', () => {
      const mockRawIndicators = [
        {
          ...baseMockRawIndicators[0],
          associatedAreaCodes: ['Area1'],
          trendsByArea: [
            {
              areaCode: 'Area1',
              trend: HealthDataPointTrendEnum.IncreasingAndGettingWorse,
            },
          ],
        },
        {
          ...baseMockRawIndicators[1],
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
        },
      ];

      const result = indicatorMapper.toEntities(
        mockRawIndicators,
        ['Area1'],
        true
      );

      expect(result).toEqual([
        {
          ...baseExpectedMappedIndicators[0],
          trend: 'Increasing and getting worse',
        },
        {
          ...baseExpectedMappedIndicators[1],
          trend: 'Decreasing',
        },
      ]);
    });

    it('maps trend to undefined when a user has requested an indicator in more than one area', () => {
      const mockRawIndicators = [
        {
          ...baseMockRawIndicators[0],
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
        },
      ];

      const result = indicatorMapper.toEntities(
        mockRawIndicators,
        ['Area1', 'Area2'],
        true
      );

      expect(result).toEqual([
        {
          ...baseExpectedMappedIndicators[0],
          trend: undefined,
        },
      ]);
    });

    // Edge case that could occur due to data issues. If an indicator does appear in an area but a trend was not calculated
    // for that particular area, fall back to undefined so the UI will render appropriately
    it('maps trend to undefined when no trend can be found for the area code', () => {
      const mockRawIndicators = [
        {
          ...baseMockRawIndicators[0],
          associatedAreaCodes: ['Area1', 'Area2'],
          trendsByArea: [
            {
              areaCode: 'Area1',
              trend: HealthDataPointTrendEnum.IncreasingAndGettingWorse,
            },
          ],
        },
      ];

      const result = indicatorMapper.toEntities(
        mockRawIndicators,
        ['Area2'],
        false
      );

      expect(result).toEqual([
        {
          ...baseExpectedMappedIndicators[0],
          trend: undefined,
        },
      ]);
    });

    // DHSCFT-198 - AC1 - if no area specified but England chosen as group, then return the trend for England
    it('retrieves the trend for England when no area has been specificed but England chosen as group', () => {
      const mockRawIndicators = [
        {
          ...baseMockRawIndicators[0],
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
        },
      ];

      const result = indicatorMapper.toEntities(mockRawIndicators, [], true);

      expect(result).toEqual([
        {
          ...baseExpectedMappedIndicators[0],
          trend: 'Decreasing and getting better',
        },
      ]);
    });
  });
});
