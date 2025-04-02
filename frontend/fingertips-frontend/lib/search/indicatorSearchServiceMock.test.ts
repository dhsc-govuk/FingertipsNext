import { HealthDataPointTrendEnum } from '@/generated-sources/ft-api-client/models/HealthDataPoint';
import { IndicatorSearchServiceMock } from './indicatorSearchServiceMock';
import {
  IIndicatorSearchService,
  IndicatorDocument,
  RawIndicatorDocument,
} from './searchTypes';

describe('IndicatorSearchServiceMock', () => {
  const mockRawData: RawIndicatorDocument[] = [
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
  const mockMappedData: IndicatorDocument[] = [
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
  ];
  let indicatorSearchMock: IIndicatorSearchService;

  beforeAll(() => {
    indicatorSearchMock = new IndicatorSearchServiceMock(mockRawData);
  });

  it('should be successfully instantiated', async () => {
    expect(indicatorSearchMock).toBeInstanceOf(IndicatorSearchServiceMock);
  });

  describe('searchWith', () => {
    it('should perform a search operation on name', async () => {
      const expectedResult = {
        ...mockMappedData[0],
        trend: undefined,
      };

      expect(await indicatorSearchMock.searchWith('faced', false)).toEqual([
        expectedResult,
      ]);
    });

    it('should perform a search operation on definition', async () => {
      const expectedResult = {
        ...mockMappedData[1],
        trend: undefined,
      };

      expect(await indicatorSearchMock.searchWith('justice', false)).toEqual([
        expectedResult,
      ]);
    });

    it('should filter out any not in Area1', async () => {
      expect(
        await indicatorSearchMock.searchWith('Red', false, ['Area1'])
      ).toEqual(mockMappedData);
    });

    it('should filter out any not in Area2', async () => {
      const expectedResult = {
        ...mockMappedData[1],
        // This is the trend for this indicator in Area2
        trend: 'No significant change',
      };

      expect(
        await indicatorSearchMock.searchWith('Red', false, ['Area2'])
      ).toEqual([expectedResult]);
    });

    it('should filter all out if unknown area', async () => {
      expect(
        await indicatorSearchMock.searchWith('justice', false, [
          'Leamington Spa',
        ])
      ).toHaveLength(0);
    });

    it('indicator should be case agnostic', async () => {
      const expectedResult = {
        ...mockMappedData[1],
        trend: undefined,
      };

      expect(await indicatorSearchMock.searchWith('Justice', false)).toEqual([
        expectedResult,
      ]);
    });

    it('area should be case agnostic', async () => {
      const expectedResult = {
        ...mockMappedData[1],
        trend: undefined,
      };

      expect(
        await indicatorSearchMock.searchWith('justice', false, ['area2'])
      ).toEqual([expectedResult]);
    });
  });

  describe('getDocument', () => {
    it('should return the document corresponding to a given documentId', async () => {
      const expectedResult = {
        ...mockMappedData[1],
        trend: undefined,
      };
      expect(await indicatorSearchMock.getIndicator('2')).toEqual(
        expectedResult
      );
    });

    it('should return nothing if given an invalid document id', async () => {
      expect(
        await indicatorSearchMock.getIndicator('invalid id')
      ).toBeUndefined();
    });
  });
});
